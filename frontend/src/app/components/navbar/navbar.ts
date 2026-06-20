// Decorador para definir un componente de Angular.
import { Component } from '@angular/core';

// Módulo con directivas comunes como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  // Inyección del Router para realizar redirecciones.
  constructor(private router: Router) {}

  // Verifica si existe un usuario guardado en localStorage.
  estaLogueado(): boolean {
    return localStorage.getItem('usuario') !== null;
  }

  // Cierra la sesión del usuario actual.
  cerrarSesion() {

    // Elimina la información del usuario almacenada localmente.
    localStorage.removeItem('usuario');

    // Redirige al login.
    this.router.navigate(['/login']);
  }
}