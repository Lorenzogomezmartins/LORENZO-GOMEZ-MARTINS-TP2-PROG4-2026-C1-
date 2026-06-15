import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PublicacionesService } from '../../services/publicaciones';
import { AuthService } from '../../services/auth';
import { PublicacionCard } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-publicaciones',
  imports: [CommonModule, ReactiveFormsModule, PublicacionCard],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.scss',
})
export class Publicaciones {
  publicaciones: any[] = [];
  usuarioActual: any;

  publicacionForm!: FormGroup;
  imagenSeleccionada: File | null = null;

  orden = 'fecha';
  offset = 0;
  limit = 5;
  total = 0;

  mensaje = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private publicacionesService: PublicacionesService,
    private authService: AuthService,
  ) {
    this.usuarioActual = this.authService.obtenerUsuario();

    this.publicacionForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });

    this.cargarPublicaciones();
  }

  seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  crearPublicacion() {
    this.mensaje = '';
    this.error = '';

    if (!this.usuarioActual) {
      this.error = 'Tenés que iniciar sesión.';
      return;
    }

    if (this.publicacionForm.invalid) {
      this.error = 'Completá título y descripción.';
      this.publicacionForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('titulo', this.publicacionForm.value.titulo || '');
    formData.append(
      'descripcion',
      this.publicacionForm.value.descripcion || '',
    );
    formData.append('usuarioId', this.usuarioActual._id);

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    this.publicacionesService.crearPublicacion(formData).subscribe({
      next: () => {
        this.mensaje = 'Publicación creada correctamente.';
        this.publicacionForm.reset();
        this.imagenSeleccionada = null;
        this.offset = 0;
        this.cargarPublicaciones();
      },
      error: (err) => {
        this.error =
          err.error?.message || 'No se pudo crear la publicación.';
      },
    });
  }

  cargarPublicaciones() {
    this.publicacionesService
      .listarPublicaciones(this.orden, this.offset, this.limit)
      .subscribe({
        next: (resp: any) => {
          this.publicaciones = resp.publicaciones;
          this.total = resp.total;
        },
        error: () => {
          this.error = 'No se pudieron cargar las publicaciones.';
        },
      });
  }

  cambiarOrden(nuevoOrden: string) {
    this.orden = nuevoOrden;
    this.offset = 0;
    this.cargarPublicaciones();
  }

  paginaAnterior() {
    if (this.offset === 0) {
      return;
    }

    this.offset -= this.limit;
    this.cargarPublicaciones();
  }

  paginaSiguiente() {
    if (this.offset + this.limit >= this.total) {
      return;
    }

    this.offset += this.limit;
    this.cargarPublicaciones();
  }

  manejarLike(publicacion: any) {
    if (!this.usuarioActual) {
      this.error = 'Tenés que iniciar sesión.';
      return;
    }

    const yaDioLike = publicacion.likes.some(
      (id: string) => id === this.usuarioActual._id,
    );

    const accion = yaDioLike
      ? this.publicacionesService.quitarLike(
          publicacion._id,
          this.usuarioActual._id,
        )
      : this.publicacionesService.darLike(
          publicacion._id,
          this.usuarioActual._id,
        );

    accion.subscribe({
      next: () => this.cargarPublicaciones(),
      error: (err) => {
        this.error =
          err.error?.message || 'No se pudo actualizar el like.';
      },
    });
  }

  eliminarPublicacion(publicacion: any) {
    if (!this.usuarioActual) {
      this.error = 'Tenés que iniciar sesión.';
      return;
    }

    const confirma = confirm('¿Querés eliminar esta publicación?');

    if (!confirma) {
      return;
    }

    this.publicacionesService
      .eliminarPublicacion(
        publicacion._id,
        this.usuarioActual._id,
        this.usuarioActual.perfil,
      )
      .subscribe({
        next: () => this.cargarPublicaciones(),
        error: (err) => {
          this.error =
            err.error?.message || 'No se pudo eliminar la publicación.';
        },
      });
  }
}