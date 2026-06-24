import { CommonModule } from '@angular/common'; // Módulo común de Angular: permite usar directivas como *ngIf y *ngFor
import { Component } from '@angular/core'; // Decorador para definir un componente de Angular
import {
  FormBuilder, // Servicio que facilita la creación de formularios reactivos
  FormGroup, // Tipo que representa un formulario reactivo
  ReactiveFormsModule, // Módulo necesario para usar formularios reactivos en Angular
  Validators, // Validadores propios de Angular, como required
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router'; // Permite obtener parámetros de la ruta actual, como el ID de la publicación

import { AuthService } from '../../services/auth'; // Servicio para obtener el usuario logueado
import { PublicacionesService } from '../../services/publicaciones'; // Servicio para consultar publicaciones al backend
import { ComentariosService } from '../../services/comentarios'; // Servicio para crear, listar y editar comentarios

// Define el componente de detalle de una publicación
@Component({
  selector: 'app-publicacion-detalle', // Nombre de la etiqueta del componente: <app-publicacion-detalle>
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios para HTML y formularios reactivos
  templateUrl: './publicacion-detalle.html', // Archivo HTML asociado
  styleUrl: './publicacion-detalle.scss', // Archivo SCSS asociado
})
export class PublicacionDetalle {

  publicacion: any;
 
  usuarioActual: any;
  
  comentarios: any[] = [];
 
  comentarioForm!: FormGroup;
  
  editarForm!: FormGroup;
 
  publicacionId = '';

  offset = 0;
 
  limit = 5;

  totalComentarios = 0;

  comentarioEditando: any = null;

  error = '';

  modalVisible = false;

  modalTitulo = '';

  modalMensaje = '';

  // Inyección de dependencias
  constructor(
    private route: ActivatedRoute, // Permite leer el ID que viene en la ruta
    private fb: FormBuilder, // Permite crear formularios reactivos
    private authService: AuthService, // Permite obtener el usuario actual desde localStorage
    private publicacionesService: PublicacionesService, // Permite traer la publicación desde el backend
    private comentariosService: ComentariosService, // Permite manejar comentarios desde el backend
  ) {
    // Obtiene el usuario actualmente logueado
    this.usuarioActual = this.authService.obtenerUsuario();

    // Obtiene el ID de la publicación desde la URL
    // Ejemplo: /publicaciones/123 → id = 123
    this.publicacionId = this.route.snapshot.paramMap.get('id') || '';

    // Crea el formulario para publicar un comentario
    this.comentarioForm = this.fb.group({
      mensaje: ['', [Validators.required]], // Campo obligatorio
    });

    // Crea el formulario para editar un comentario
    this.editarForm = this.fb.group({
      mensaje: ['', [Validators.required]], // Campo obligatorio
    });

    // Carga los datos de la publicación al iniciar el componente
    this.cargarPublicacion();

    // Carga los primeros comentarios al iniciar el componente
    this.cargarComentarios();
  }

  // =====================================================
  // CARGAR PUBLICACIÓN
  // =====================================================

  cargarPublicacion() {
    // Llama al servicio para obtener la publicación por su ID
    this.publicacionesService
      .obtenerPublicacionPorId(this.publicacionId)
      .subscribe({
        // Si el backend responde correctamente, guarda la publicación
        next: (resp: any) => {
          this.publicacion = resp;
        },

        // Si ocurre un error, muestra mensaje
        error: () => {
          this.error = 'No se pudo cargar la publicación.';
        },
      });
  }

  // =====================================================
  // CARGAR COMENTARIOS
  // =====================================================

  cargarComentarios() {
    // Llama al servicio para obtener comentarios con paginación
    this.comentariosService
      .listarComentarios(this.publicacionId, this.offset, this.limit)
      .subscribe({
        // Si el backend responde correctamente
        next: (resp: any) => {
          // Agrega los nuevos comentarios a los que ya estaban cargados
          // Esto permite que "Cargar más" no borre los comentarios anteriores
          this.comentarios = [
            ...this.comentarios,
            ...resp.comentarios,
          ];

          // Guarda el total de comentarios disponibles
          this.totalComentarios = resp.total;
        },

        // Si ocurre un error al cargar comentarios
        error: () => {
          this.error = 'No se pudieron cargar los comentarios.';
        },
      });
  }

  // =====================================================
  // CARGAR MÁS COMENTARIOS
  // =====================================================

  cargarMasComentarios() {
    // Aumenta el offset para pedir el siguiente bloque de comentarios
    this.offset += this.limit;

    // Vuelve a llamar al backend para traer más comentarios
    this.cargarComentarios();
  }

  // =====================================================
  // CREAR COMENTARIO
  // =====================================================

  crearComentario() {
    // Limpia errores anteriores
    this.error = '';

    // Si el formulario está incompleto, se corta el proceso
    if (this.comentarioForm.invalid) {
      this.error = 'Escribí un comentario.';

      // Marca el campo como tocado para mostrar errores en el HTML
      this.comentarioForm.markAllAsTouched();

      return;
    }

    // Llama al backend para crear el comentario
    this.comentariosService
      .crearComentario(this.publicacionId, {
        mensaje: this.comentarioForm.value.mensaje, // Mensaje escrito por el usuario
        usuarioId: this.usuarioActual._id, // ID del usuario que comenta
      })
      .subscribe({
        // Si el comentario se creó correctamente
        next: () => {
          // Muestra modal de éxito
          this.mostrarModal(
            'Comentario publicado',
            'Tu comentario se agregó correctamente.',
          );

          // Limpia el formulario
          this.comentarioForm.reset();

          // Reinicia la paginación desde el inicio
          this.offset = 0;

          // Vacía la lista para volver a cargar desde cero
          this.comentarios = [];

          // Recarga los comentarios actualizados
          this.cargarComentarios();
        },

        // Si ocurre un error al crear el comentario
        error: (err) => {
          this.error =
            err.error?.message || 'No se pudo crear el comentario.';
        },
      });
  }

  // =====================================================
  // INICIAR EDICIÓN
  // =====================================================

  iniciarEdicion(comentario: any) {
    // Guarda cuál comentario se está editando
    this.comentarioEditando = comentario;

    // Carga en el formulario de edición el mensaje actual del comentario
    this.editarForm.patchValue({
      mensaje: comentario.mensaje,
    });
  }

  // =====================================================
  // CANCELAR EDICIÓN
  // =====================================================

  cancelarEdicion() {
    // Quita el comentario en edición
    this.comentarioEditando = null;

    // Limpia el formulario de edición
    this.editarForm.reset();
  }

  // =====================================================
  // GUARDAR EDICIÓN
  // =====================================================

  guardarEdicion() {
    // Si el formulario está inválido o no hay comentario seleccionado, se corta el proceso
    if (this.editarForm.invalid || !this.comentarioEditando) {
      return;
    }

    // Llama al backend para editar el comentario seleccionado
    this.comentariosService
      .editarComentario(this.comentarioEditando._id, {
        mensaje: this.editarForm.value.mensaje, // Nuevo mensaje editado
        usuarioId: this.usuarioActual._id, // ID del usuario, usado para verificar que sea el autor
      })
      .subscribe({
        // Si el comentario se editó correctamente
        next: () => {
          // Muestra modal de éxito
          this.mostrarModal(
            'Comentario editado',
            'Tu comentario fue modificado correctamente.',
          );

          // Sale del modo edición
          this.comentarioEditando = null;

          // Limpia el formulario de edición
          this.editarForm.reset();

          // Reinicia la paginación
          this.offset = 0;

          // Vacía comentarios actuales
          this.comentarios = [];

          // Recarga comentarios actualizados
          this.cargarComentarios();
        },

        // Si ocurre error al editar
        error: (err) => {
          this.error =
            err.error?.message || 'No se pudo editar el comentario.';
        },
      });
  }

  // =====================================================
  // VERIFICAR SI EL USUARIO PUEDE EDITAR
  // =====================================================

  puedeEditar(comentario: any): boolean {
    // Devuelve true si el usuario logueado es el autor del comentario
    return comentario.usuario?._id === this.usuarioActual?._id;
  }

  // =====================================================
  // FORMATEAR FECHA
  // =====================================================

  formatearFecha(fecha: string): string {
    // Si no hay fecha, devuelve string vacío
    if (!fecha) {
      return '';
    }

    // Convierte la fecha a formato argentino con día, mes, año y hora completa
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // =====================================================
  // MOSTRAR MODAL
  // =====================================================

  mostrarModal(titulo: string, mensaje: string) {
    // Asigna título del modal
    this.modalTitulo = titulo;

    // Asigna mensaje del modal
    this.modalMensaje = mensaje;

    // Hace visible el modal
    this.modalVisible = true;
  }

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  cerrarModal() {
    // Oculta el modal
    this.modalVisible = false;
  }
}