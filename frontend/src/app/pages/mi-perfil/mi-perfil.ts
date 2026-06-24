import { CommonModule } from '@angular/common'; // Módulo común de Angular: permite usar directivas como *ngIf y *ngFor
import { Component } from '@angular/core'; // Decorador para definir un componente de Angular

import { AuthService } from '../../services/auth'; // Servicio para obtener los datos del usuario logueado
import { PublicacionesService } from '../../services/publicaciones'; // Servicio para consultar publicaciones al backend
import { ComentariosService } from '../../services/comentarios'; // Servicio para consultar comentarios al backend

import { PublicacionCard } from '../../components/publicacion-card/publicacion-card'; // Componente reutilizable para mostrar una publicación

// Define el componente de la página "Mi Perfil"
@Component({
  selector: 'app-mi-perfil', // Nombre de la etiqueta HTML: <app-mi-perfil>
  imports: [CommonModule, PublicacionCard], // Módulos/componentes que usa este componente standalone
  templateUrl: './mi-perfil.html', // Archivo HTML asociado
  styleUrl: './mi-perfil.scss', // Archivo SCSS asociado
})
export class MiPerfil {
  usuarioActual: any;

  publicaciones: any[] = [];

  misComentarios: any[] = [];

  // Controla qué sección se muestra en pantalla
  vistaActiva: 'publicaciones' | 'comentarios' = 'publicaciones';

  // Mensaje de error general
  error = '';

  // Inyección de dependencias
  constructor(
    private authService: AuthService, // Permite obtener el usuario guardado en localStorage
    private publicacionesService: PublicacionesService, // Permite traer publicaciones del usuario
    private comentariosService: ComentariosService, // Permite traer comentarios del usuario
  ) {
    // Obtiene el usuario actual desde localStorage
    this.usuarioActual = this.authService.obtenerUsuario();

    // Carga las publicaciones propias al iniciar el componente
    this.cargarMisPublicaciones();

    // Carga los comentarios propios al iniciar el componente
    this.cargarMisComentarios();
  }

  // Cambia entre la vista de publicaciones y la vista de comentarios
  cambiarVista(vista: 'publicaciones' | 'comentarios') {
    this.vistaActiva = vista;
  }

  // Carga las publicaciones creadas por el usuario logueado
  cargarMisPublicaciones() {
    // Si no hay usuario logueado, muestra error y corta el proceso
    if (!this.usuarioActual) {
      this.error = 'No hay usuario logueado.';
      return;
    }

    // Llama al backend para listar publicaciones filtradas por usuario
    this.publicacionesService
      .listarPublicaciones(
        'fecha', // Ordena las publicaciones por fecha
        0, // Offset inicial
        3, // Trae como máximo 3 publicaciones
        this.usuarioActual._id, // Filtra por el ID del usuario actual
      )
      .subscribe({
        // Si el backend responde correctamente, guarda las publicaciones
        next: (resp: any) => {
          this.publicaciones = resp.publicaciones;
        },

        // Si ocurre un error, muestra mensaje
        error: () => {
          this.error = 'No se pudieron cargar tus publicaciones.';
        },
      });
  }

  // Carga los comentarios realizados por el usuario logueado
  cargarMisComentarios() {
    // Si no hay usuario logueado, corta el proceso
    if (!this.usuarioActual) {
      return;
    }

    // Llama al backend para traer los comentarios del usuario
    this.comentariosService
      .listarComentariosDeUsuario(this.usuarioActual._id)
      .subscribe({
        // Si el backend responde correctamente, guarda los comentarios
        next: (resp: any) => {
          this.misComentarios = resp.comentarios;
        },

        // Si ocurre un error, muestra mensaje
        error: () => {
          this.error = 'No se pudieron cargar tus comentarios.';
        },
      });
  }
}