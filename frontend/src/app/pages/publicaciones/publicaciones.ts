// Módulo con directivas comunes como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Decorador para definir un componente de Angular.
import { Component } from '@angular/core';

// Herramientas para crear y validar formularios reactivos.
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Servicio encargado de comunicarse con el backend de publicaciones.
import { PublicacionesService } from '../../services/publicaciones';

// Servicio usado para obtener el usuario logueado.
import { AuthService } from '../../services/auth';

// Componente reutilizable para mostrar cada publicación.
import { PublicacionCard } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-publicaciones',
  imports: [CommonModule, ReactiveFormsModule, PublicacionCard],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.scss',
})
export class Publicaciones {
  // Lista de publicaciones recibidas desde el backend.
  publicaciones: any[] = [];

  // Usuario actualmente guardado en localStorage.
  usuarioActual: any;

  // Formulario para crear publicaciones.
  publicacionForm!: FormGroup;

  // Imagen seleccionada para la publicación.
  imagenSeleccionada: File | null = null;

  // Criterio de ordenamiento de publicaciones.
  orden = 'fecha';

  // Cantidad de registros que se saltean para paginar.
  offset = 0;

  // Cantidad máxima de publicaciones por página.
  limit = 5;

  // Total de publicaciones existentes.
  total = 0;

  // Mensaje de éxito.
  mensaje = '';

  // Mensaje de error.
  error = '';

  constructor(
    private fb: FormBuilder,
    private publicacionesService: PublicacionesService,
    private authService: AuthService,
  ) {
    // Obtiene el usuario logueado desde localStorage.
    this.usuarioActual = this.authService.obtenerUsuario();

    // Crea el formulario de publicación con sus validaciones.
    this.publicacionForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });

    // Carga las publicaciones al entrar a la página.
    this.cargarPublicaciones();
  }

  // Guarda la imagen seleccionada desde el input file.
  seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    // Si el usuario seleccionó un archivo, guarda el primero.
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  // Crea una nueva publicación.
  crearPublicacion() {
    // Limpia mensajes anteriores.
    this.mensaje = '';
    this.error = '';

    // Evita publicar si no hay usuario logueado.
    if (!this.usuarioActual) {
      this.error = 'Tenés que iniciar sesión.';
      return;
    }

    // Valida que el formulario tenga título y descripción.
    if (this.publicacionForm.invalid) {
      this.error = 'Completá título y descripción.';
      this.publicacionForm.markAllAsTouched();
      return;
    }

    // FormData permite enviar texto e imagen en la misma petición.
    const formData = new FormData();

    // Agrega los campos de la publicación.
    formData.append('titulo', this.publicacionForm.value.titulo || '');
    formData.append(
      'descripcion',
      this.publicacionForm.value.descripcion || '',
    );

    // Agrega el id del usuario creador de la publicación.
    formData.append('usuarioId', this.usuarioActual._id);

    // Si se seleccionó imagen, la agrega al FormData.
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    // Envía la publicación al backend.
    this.publicacionesService.crearPublicacion(formData).subscribe({
      // Si se crea correctamente, limpia el formulario y recarga el listado.
      next: () => {
        this.mensaje = 'Publicación creada correctamente.';
        this.publicacionForm.reset();
        this.imagenSeleccionada = null;
        this.offset = 0;
        this.cargarPublicaciones();
      },

      // Si falla, muestra el error del backend.
      error: (err) => {
        this.error =
          err.error?.message || 'No se pudo crear la publicación.';
      },
    });
  }

  // Carga publicaciones desde el backend según orden y paginación.
  cargarPublicaciones() {
    this.publicacionesService
      .listarPublicaciones(this.orden, this.offset, this.limit)
      .subscribe({
        // Guarda las publicaciones y el total recibido.
        next: (resp: any) => {
          this.publicaciones = resp.publicaciones;
          this.total = resp.total;
        },

        // Muestra error si no se pudo cargar el listado.
        error: () => {
          this.error = 'No se pudieron cargar las publicaciones.';
        },
      });
  }

  // Cambia el criterio de ordenamiento y vuelve a la primera página.
  cambiarOrden(nuevoOrden: string) {
    this.orden = nuevoOrden;
    this.offset = 0;
    this.cargarPublicaciones();
  }

  // Retrocede una página en el listado.
  paginaAnterior() {
    // Si ya está en la primera página, no hace nada.
    if (this.offset === 0) {
      return;
    }

    this.offset -= this.limit;
    this.cargarPublicaciones();
  }

  // Avanza una página en el listado.
  paginaSiguiente() {
    // Si ya no hay más publicaciones, no hace nada.
    if (this.offset + this.limit >= this.total) {
      return;
    }

    this.offset += this.limit;
    this.cargarPublicaciones();
  }

  // Da o quita like según si el usuario ya había dado like.
  manejarLike(publicacion: any) {
    // Evita dar like si no hay usuario logueado.
    if (!this.usuarioActual) {
      this.error = 'Tenés que iniciar sesión.';
      return;
    }

    // Verifica si el id del usuario actual ya está dentro del array de likes.
    const yaDioLike = publicacion.likes.some(
      (id: string) => id === this.usuarioActual._id,
    );

    // Si ya dio like, lo quita. Si no dio like, lo agrega.
    const accion = yaDioLike
      ? this.publicacionesService.quitarLike(
          publicacion._id,
          this.usuarioActual._id,
        )
      : this.publicacionesService.darLike(
          publicacion._id,
          this.usuarioActual._id,
        );

    // Ejecuta la acción correspondiente y recarga publicaciones.
    accion.subscribe({
      next: () => this.cargarPublicaciones(),
      error: (err) => {
        this.error =
          err.error?.message || 'No se pudo actualizar el like.';
      },
    });
  }

  // Elimina una publicación si el usuario tiene permiso.
  eliminarPublicacion(publicacion: any) {
    // Evita eliminar si no hay usuario logueado.
    if (!this.usuarioActual) {
      this.error = 'Tenés que iniciar sesión.';
      return;
    }

    // Pide confirmación antes de eliminar.
    const confirma = confirm('¿Querés eliminar esta publicación?');

    // Si el usuario cancela, no continúa.
    if (!confirma) {
      return;
    }

    // Solicita al backend eliminar la publicación.
    this.publicacionesService
      .eliminarPublicacion(
        publicacion._id,
        this.usuarioActual._id,
        this.usuarioActual.perfil,
      )
      .subscribe({
        // Si se elimina correctamente, recarga el listado.
        next: () => this.cargarPublicaciones(),

        // Si falla, muestra el error correspondiente.
        error: (err) => {
          this.error =
            err.error?.message || 'No se pudo eliminar la publicación.';
        },
      });
  }

  activarPublicacion(publicacion: any) {
  if (!this.usuarioActual) {
    this.error = 'Tenés que iniciar sesión.';
    return;
  }

  const confirma = confirm('¿Querés dar de alta esta publicación?');

  if (!confirma) {
    return;
  }

  this.publicacionesService
    .activarPublicacion(
  publicacion._id,
  this.usuarioActual,
)
    .subscribe({
      next: () => this.cargarPublicaciones(),
      error: (err) => {
        this.error =
          err.error?.message || 'No se pudo activar la publicación.';
      },
    });
}
}