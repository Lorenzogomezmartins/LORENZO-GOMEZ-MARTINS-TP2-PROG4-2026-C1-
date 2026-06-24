import { Component, OnInit } from '@angular/core'; // Component define el componente y OnInit permite ejecutar lógica al iniciar
import { Router } from '@angular/router'; // Servicio para navegar entre rutas

import { AuthService } from '../../services/auth'; // Servicio de autenticación del frontend

// Define el componente de pantalla de carga
@Component({
  selector: 'app-cargando', // Nombre de la etiqueta HTML: <app-cargando>
  templateUrl: './cargando.html', // Archivo HTML asociado
  styleUrl: './cargando.scss', // Archivo SCSS asociado
})
export class Cargando implements OnInit {
  // Inyección de dependencias
  constructor(
    private authService: AuthService, // Permite obtener token, autorizar sesión y cerrar sesión
    private router: Router, // Permite redirigir al usuario
  ) {}

  // Se ejecuta automáticamente cuando se inicia el componente
  ngOnInit(): void {
    // Obtiene el token guardado en localStorage
    const token = this.authService.obtenerToken();

    // Si no hay token, significa que no hay sesión iniciada
    if (!token) {
      // Redirige al login
      this.router.navigate(['/login']);
      return;
    }

    // Si existe token, se consulta al backend para validar si sigue siendo correcto
    this.authService.autorizar().subscribe({
      // Si el token es válido
      next: () => {
        // Redirige a la pantalla principal de publicaciones
        this.router.navigate(['/publicaciones']);
      },

      // Si el token es inválido, vencido o pertenece a un usuario deshabilitado
      error: () => {
        // Elimina usuario y token del localStorage
        this.authService.cerrarSesion();

        // Redirige al login
        this.router.navigate(['/login']);
      },
    });
  }
}