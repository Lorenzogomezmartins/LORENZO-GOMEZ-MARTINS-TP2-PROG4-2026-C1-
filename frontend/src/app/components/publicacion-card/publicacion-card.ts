import { CommonModule } from '@angular/common'; // Módulo común de Angular: permite usar directivas como *ngIf y *ngFor
import { Component, EventEmitter, Input, Output } from '@angular/core'; // Component define el componente, Input recibe datos, Output emite eventos y EventEmitter crea esos eventos
import { FormsModule } from '@angular/forms'; // Permite usar formularios simples con ngModel

import { ComentariosService } from '../../services/comentarios'; // Servicio para listar, crear y editar comentarios desde el backend

// Define el componente reutilizable de tarjeta de publicación
@Component({
  selector: 'app-publicacion-card', // Nombre de la etiqueta HTML: <app-publicacion-card>
  imports: [CommonModule, FormsModule], // Módulos que usa este componente standalone
  templateUrl: './publicacion-card.html', // Archivo HTML asociado
  styleUrl: './publicacion-card.scss', // Archivo SCSS asociado
})
export class PublicacionCard {
  @Input() publicacion: any;
  @Input() usuarioActual: any;
  @Output() like = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  comentariosAbiertos = false;
  comentarios: any[] = [];

  totalComentarios = 0;
  offsetComentarios = 0;
  limitComentarios = 5;
  nuevoComentario = '';
  comentarioEditandoId = '';
  textoEditado = '';
  errorComentarios = '';

  // Inyección del servicio de comentarios
  constructor(private comentariosService: ComentariosService) {}

  // Verifica si el usuario actual ya le dio like a esta publicación
  usuarioDioLike(): boolean {
    // Si no hay usuario logueado o la publicación no tiene array de likes, devuelve false
    if (!this.usuarioActual || !this.publicacion?.likes) {
      return false;
    }

    // Recorre los IDs de likes y verifica si alguno coincide con el usuario actual
    return this.publicacion.likes.some(
      (id: string) => id === this.usuarioActual._id,
    );
  }

  // Verifica si el usuario actual puede eliminar esta publicación
  puedeEliminar(): boolean {
    // Si no hay usuario logueado o la publicación no tiene usuario autor, devuelve false
    if (!this.usuarioActual || !this.publicacion?.usuario) {
      return false;
    }

    // Puede eliminar si:
    // 1) Es el autor de la publicación
    // 2) Tiene perfil de administrador
    return (
      this.publicacion.usuario._id === this.usuarioActual._id ||
      this.usuarioActual.perfil === 'administrador'
    );
  }

  // Verifica si el usuario actual puede editar un comentario
  puedeEditar(comentario: any): boolean {
    // Solo puede editar el comentario quien lo escribió
    return comentario.usuario?._id === this.usuarioActual?._id;
  }

  // Abre o cierra la sección de comentarios
  abrirCerrarComentarios() {
    // Invierte el estado actual: si estaba cerrado, abre; si estaba abierto, cierra
    this.comentariosAbiertos = !this.comentariosAbiertos;

    // Si se abren los comentarios por primera vez, los carga desde el backend
    if (this.comentariosAbiertos && this.comentarios.length === 0) {
      this.cargarComentarios();
    }
  }

  // Carga comentarios de esta publicación desde el backend
  cargarComentarios() {
    // Llama al servicio usando el ID de la publicación, offset y limit
    this.comentariosService
      .listarComentarios(
        this.publicacion._id,
        this.offsetComentarios,
        this.limitComentarios,
      )
      .subscribe({
        // Si la petición sale bien
        next: (resp: any) => {
          // Agrega los comentarios nuevos a la lista existente
          // Esto permite que el botón "cargar más" no borre los anteriores
          this.comentarios = [
            ...this.comentarios,
            ...resp.comentarios,
          ];

          // Guarda el total de comentarios de la publicación
          this.totalComentarios = resp.total;
        },

        // Si ocurre un error
        error: () => {
          this.errorComentarios = 'No se pudieron cargar los comentarios.';
        },
      });
  }

  // Carga el siguiente bloque de comentarios
  cargarMasComentarios() {
    // Aumenta el offset para pedir los comentarios siguientes
    this.offsetComentarios += this.limitComentarios;

    // Vuelve a pedir comentarios al backend
    this.cargarComentarios();
  }

  // Crea un nuevo comentario en esta publicación
  crearComentario() {
    // Limpia errores anteriores
    this.errorComentarios = '';

    // Valida que el comentario no esté vacío o solo con espacios
    if (!this.nuevoComentario.trim()) {
      this.errorComentarios = 'Escribí un comentario.';
      return;
    }

    // Llama al backend para crear el comentario
    this.comentariosService
      .crearComentario(this.publicacion._id, {
        mensaje: this.nuevoComentario, // Texto del comentario
        usuarioId: this.usuarioActual._id, // ID del usuario que comenta
      })
      .subscribe({
        // Si el comentario se creó correctamente
        next: () => {
          // Limpia el input de comentario
          this.nuevoComentario = '';

          // Reinicia la paginación
          this.offsetComentarios = 0;

          // Vacía la lista actual para recargar comentarios actualizados
          this.comentarios = [];

          // Vuelve a cargar comentarios desde cero
          this.cargarComentarios();

          // Cierra la sección de comentarios después de publicar
          this.comentariosAbiertos = false;
        },

        // Si ocurre un error al publicar
        error: () => {
          this.errorComentarios = 'No se pudo publicar el comentario.';
        },
      });
  }

  // Activa el modo edición para un comentario
  iniciarEdicion(comentario: any) {
    // Guarda el ID del comentario que se está editando
    this.comentarioEditandoId = comentario._id;

    // Copia el mensaje actual al campo editable
    this.textoEditado = comentario.mensaje;
  }

  // Cancela la edición del comentario
  cancelarEdicion() {
    // Limpia el ID del comentario en edición
    this.comentarioEditandoId = '';

    // Limpia el texto temporal
    this.textoEditado = '';
  }

  // Guarda la edición de un comentario
  guardarEdicion(comentario: any) {
    // Valida que el nuevo texto no esté vacío
    if (!this.textoEditado.trim()) {
      this.errorComentarios = 'El comentario no puede quedar vacío.';
      return;
    }

    // Llama al backend para editar el comentario
    this.comentariosService
      .editarComentario(comentario._id, {
        mensaje: this.textoEditado, // Nuevo texto del comentario
        usuarioId: this.usuarioActual._id, // ID del usuario, para validar que sea el autor
      })
      .subscribe({
        // Si la edición sale bien
        next: () => {
          // Sale del modo edición
          this.comentarioEditandoId = '';

          // Limpia el texto temporal
          this.textoEditado = '';

          // Reinicia paginación
          this.offsetComentarios = 0;

          // Vacía comentarios actuales
          this.comentarios = [];

          // Recarga comentarios actualizados
          this.cargarComentarios();
        },

        // Si ocurre error al editar
        error: () => {
          this.errorComentarios = 'No se pudo editar el comentario.';
        },
      });
  }

  // Formatea una fecha para mostrarla en formato argentino
  formatearFecha(fecha: string): string {
    // Si no hay fecha, devuelve string vacío
    if (!fecha) {
      return '';
    }

    // Convierte la fecha a formato dd/mm/aaaa hh:mm:ss
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // Se ejecuta cuando el usuario hace click en like
  clickLike() {
    // Emite la publicación hacia el componente padre
    // El padre se encarga de ejecutar la lógica real del like
    this.like.emit(this.publicacion);
  }

  // Se ejecuta cuando el usuario hace click en eliminar
  clickEliminar() {
    // Emite la publicación hacia el componente padre
    // El padre se encarga de confirmar/eliminar
    this.eliminar.emit(this.publicacion);
  }
}