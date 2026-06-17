import { Component } from '@angular/core'; // Decorador para definir componentes de Angular
import { CommonModule } from '@angular/common'; // Permite usar directivas como *ngIf y *ngFor

import { AuthService } from '../../services/auth'; // Servicio que maneja la sesión del usuario

// Define el componente de la página Mi Perfil
@Component({
  selector: 'app-mi-perfil',
  imports: [CommonModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.scss',
})
export class MiPerfil {

  // Guarda la información del usuario logueado
  usuario: any = null;

  // Inyección del servicio de autenticación
  constructor(private authService: AuthService) {

    // Obtiene el usuario almacenado en localStorage
    this.usuario = this.authService.obtenerUsuario();
  }
}