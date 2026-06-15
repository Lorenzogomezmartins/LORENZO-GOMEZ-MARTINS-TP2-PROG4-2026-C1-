import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-publicacion-card',
  imports: [CommonModule],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.scss',
})
export class PublicacionCard {
  @Input() publicacion: any;
  @Input() usuarioActual: any;

  @Output() like = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  usuarioDioLike(): boolean {
    if (!this.usuarioActual || !this.publicacion?.likes) {
      return false;
    }

    return this.publicacion.likes.some(
      (id: string) => id === this.usuarioActual._id,
    );
  }

  puedeEliminar(): boolean {
    if (!this.usuarioActual || !this.publicacion?.usuario) {
      return false;
    }

    return (
      this.publicacion.usuario._id === this.usuarioActual._id ||
      this.usuarioActual.perfil === 'administrador'
    );
  }

  clickLike() {
    this.like.emit(this.publicacion);
  }

  clickEliminar() {
    this.eliminar.emit(this.publicacion);
  }
}