// Decorador para definir un componente de Angular.
import { Component } from '@angular/core';

// Módulo con directivas comunes como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';
import { AdminOnlyDirective } from '../../directives/admin-only.directive';

// Herramientas para navegación y enlaces entre rutas.
import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
  CommonModule,
  RouterLink,
  RouterLinkActive,
  AdminOnlyDirective,
],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  // Usuario logueado que recibe la directiva appAdminOnly.
  usuarioActual = JSON.parse(
    localStorage.getItem('usuario') || 'null',
  );

  // Inyección del Router para realizar redirecciones.
  constructor(private router: Router) {}

  // Verifica si existe un usuario guardado en localStorage.
  estaLogueado(): boolean {
    return localStorage.getItem('usuario') !== null;
  }

  // Verifica si el usuario actual es administrador.
  esAdmin(): boolean {
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || 'null',
    );

    return usuario?.perfil === 'administrador';
  }

  // Cierra la sesión del usuario actual.
  cerrarSesion() {

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}