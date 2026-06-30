 // Módulo con directivas comunes como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Decorador para definir un componente de Angular.
import { Component } from '@angular/core';

// Servicio usado para obtener el usuario logueado.
import { AuthService } from '../../services/auth';

// Servicio encargado de comunicarse con el backend de publicaciones.
import { PublicacionesService } from '../../services/publicaciones';

// Componente reutilizable para mostrar cada publicación.
import { PublicacionCard } from '../../components/publicacion-card/publicacion-card';
import { ComentariosService } from '../../services/comentarios';

@Component({
  // Etiqueta HTML que representa esta página.
  selector: 'app-mi-perfil',
  imports: [CommonModule, PublicacionCard],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.scss',
})
export class MiPerfil {
  // Usuario actualmente guardado en localStorage.
  usuarioActual: any;

  // Lista de publicaciones propias del usuario.
  publicaciones: any[] = [];

  // Mensaje de error para mostrar en pantalla.
  error = '';
  comentarios: any[] = [];

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
    private comentariosService: ComentariosService,
  ) {
    // Obtiene el usuario logueado.
    this.usuarioActual = this.authService.obtenerUsuario();

    // Carga las publicaciones del usuario al entrar al perfil.
    this.cargarMisPublicaciones();
    this.cargarMisComentarios();
  }

  // Carga las publicaciones creadas por el usuario actual.
  cargarMisPublicaciones() {
    // Si no hay usuario logueado, muestra error y corta la ejecución.
    if (!this.usuarioActual) {
      this.error = 'No hay usuario logueado.';
      return;
    }

    // Pide al backend las últimas 3 publicaciones del usuario actual.
    this.publicacionesService
      .listarPublicaciones(
        'fecha',
        0,
        3,
        this.usuarioActual._id,
      )
      .subscribe({
        // Guarda las publicaciones recibidas.
        next: (resp: any) => {
          this.publicaciones = resp.publicaciones;
        },

        // Muestra error si falla la carga.
        error: () => {
          this.error = 'No se pudieron cargar tus publicaciones.';
        },
      });
  }

 cargarMisComentarios() {
  if (!this.usuarioActual) {
    this.error = 'No hay usuario logueado.';
    return;
  }

  this.comentariosService
    .listarComentariosDeUsuario(this.usuarioActual._id)
    .subscribe({
      next: (data: any) => {
        this.comentarios = data;
      },
      error: () => {
        this.error = 'No se pudieron cargar tus comentarios.';
      },
    });
}   // ← TERMINA ESTE MÉTODO

// ↓↓↓ PEGÁ ESTO ACÁ ↓↓↓

formatearFecha(fecha: string): string {
  if (!fecha) return '';

  return new Date(fecha).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
}