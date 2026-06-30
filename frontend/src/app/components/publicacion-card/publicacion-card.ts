import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ComentariosService } from '../../services/comentarios';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';

@Component({
  selector: 'app-publicacion-card',
  imports: [CommonModule, ReactiveFormsModule, AdminOnlyDirective],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.scss',
})
export class PublicacionCard {
  @Input() publicacion: any;
  @Input() usuarioActual: any;

  @Output() like = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();
  @Output() activar = new EventEmitter<any>();

  mostrarComentarios = false;
  comentarios: any[] = [];
  errorComentarios = '';

  offsetComentarios = 0;
  limiteComentarios = 5;
  hayMasComentarios = true;

  comentarioForm!: FormGroup;
  editarForm!: FormGroup;
  comentarioEditando: any = null;

  constructor(
    private comentariosService: ComentariosService,
    private fb: FormBuilder,
  ) {
    this.comentarioForm = this.fb.group({
      mensaje: ['', [Validators.required]],
    });

    this.editarForm = this.fb.group({
      mensaje: ['', [Validators.required]],
    });
  }

  usuarioDioLike(): boolean {
    if (!this.usuarioActual || !this.publicacion?.likes) return false;

    return this.publicacion.likes.some(
      (id: string) => id === this.usuarioActual._id,
    );
  }

  puedeEliminar(): boolean {
    if (!this.usuarioActual || !this.publicacion?.usuario) return false;

    return (
      this.publicacion.usuario._id === this.usuarioActual._id ||
      this.usuarioActual.perfil === 'administrador'
    );
  }

  puedeEditar(comentario: any): boolean {
    return comentario.usuario?._id === this.usuarioActual?._id;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';

    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  clickLike() {
    this.like.emit(this.publicacion);
  }

  clickEliminar() {
    this.eliminar.emit(this.publicacion);
  }
  clickActivar() {
  this.activar.emit(this.publicacion);
}

  toggleComentarios() {
    this.mostrarComentarios = !this.mostrarComentarios;

    if (this.mostrarComentarios && this.comentarios.length === 0) {
      this.reiniciarComentarios();
      this.cargarComentarios();
    }
  }

  reiniciarComentarios() {
    this.comentarios = [];
    this.offsetComentarios = 0;
    this.hayMasComentarios = true;
  }

  cargarComentarios() {
    this.errorComentarios = '';

    this.comentariosService
      .listarComentarios(
        this.publicacion._id,
        this.offsetComentarios,
        this.limiteComentarios,
      )
      .subscribe({
        next: (resp: any) => {
          const nuevosComentarios = resp.comentarios || [];

          this.comentarios = [
            ...this.comentarios,
            ...nuevosComentarios,
          ];

          this.offsetComentarios += this.limiteComentarios;

          this.hayMasComentarios =
            nuevosComentarios.length === this.limiteComentarios;
        },
        error: () => {
          this.errorComentarios = 'No se pudieron cargar los comentarios.';
        },
      });
  }

  crearComentario() {
    this.errorComentarios = '';

    if (this.comentarioForm.invalid) {
      this.errorComentarios = 'Escribí un comentario.';
      this.comentarioForm.markAllAsTouched();
      return;
    }

    this.comentariosService
      .crearComentario(this.publicacion._id, {
        mensaje: this.comentarioForm.value.mensaje,
        usuarioId: this.usuarioActual._id,
      })
      .subscribe({
        next: () => {
          this.comentarioForm.reset();
          this.reiniciarComentarios();
          this.cargarComentarios();
        },
        error: (err) => {
          this.errorComentarios =
            err.error?.message || 'No se pudo crear el comentario.';
        },
      });
  }

  iniciarEdicion(comentario: any) {
    this.comentarioEditando = comentario;

    this.editarForm.patchValue({
      mensaje: comentario.mensaje,
    });
  }

  cancelarEdicion() {
    this.comentarioEditando = null;
    this.editarForm.reset();
  }

  guardarEdicion() {
    if (this.editarForm.invalid || !this.comentarioEditando) return;

    this.comentariosService
      .editarComentario(this.comentarioEditando._id, {
        mensaje: this.editarForm.value.mensaje,
        usuarioId: this.usuarioActual._id,
      })
      .subscribe({
        next: () => {
          this.comentarioEditando = null;
          this.editarForm.reset();
          this.reiniciarComentarios();
          this.cargarComentarios();
        },
        error: (err) => {
          this.errorComentarios =
            err.error?.message || 'No se pudo editar el comentario.';
        },
      });
  }
}