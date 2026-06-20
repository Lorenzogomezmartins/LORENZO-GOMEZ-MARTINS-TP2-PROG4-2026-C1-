// Módulo con directivas comunes como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Decoradores y herramientas para comunicación entre componentes.
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  // Etiqueta HTML que representa este componente.
  selector: 'app-publicacion-card',

  // Módulos utilizados en el HTML.
  imports: [CommonModule],

  // Archivo HTML asociado.
  templateUrl: './publicacion-card.html',

  // Archivo de estilos asociado.
  styleUrl: './publicacion-card.scss',
})
export class PublicacionCard {
  // Publicación que se mostrará en la tarjeta.
  @Input() publicacion: any;

  // Usuario actualmente logueado.
  @Input() usuarioActual: any;

  // Evento enviado al componente padre cuando se presiona Like.
  @Output() like = new EventEmitter<any>();

  // Evento enviado al componente padre cuando se presiona Eliminar.
  @Output() eliminar = new EventEmitter<any>();

  // Verifica si el usuario actual ya dio like a la publicación.
  usuarioDioLike(): boolean {
    // Si no hay usuario o no existen likes, devuelve false.
    if (!this.usuarioActual || !this.publicacion?.likes) {
      return false;
    }

    // Busca si el id del usuario existe dentro del array de likes.
    return this.publicacion.likes.some(
      (id: string) => id === this.usuarioActual._id,
    );
  }

  // Verifica si el usuario tiene permisos para eliminar la publicación.
  puedeEliminar(): boolean {
    // Si no hay usuario o no existe el creador de la publicación, devuelve false.
    if (!this.usuarioActual || !this.publicacion?.usuario) {
      return false;
    }

    // Permite eliminar si es el dueño o si es administrador.
    return (
      this.publicacion.usuario._id === this.usuarioActual._id ||
      this.usuarioActual.perfil === 'administrador'
    );
  }

  // Formatea fecha y hora de creación de la publicación.
  formatearFecha(fecha: string): string {
    if (!fecha) {
      return '';
    }

    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // Emite el evento de like hacia el componente padre.
  clickLike() {
    this.like.emit(this.publicacion);
  }

  // Emite el evento de eliminación hacia el componente padre.
  clickEliminar() {
    this.eliminar.emit(this.publicacion);
  }
}