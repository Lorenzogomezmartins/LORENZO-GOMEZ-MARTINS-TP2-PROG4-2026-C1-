import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-mi-perfil',
  imports: [CommonModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.scss',
})
export class MiPerfil {
  usuario: any = null;

  constructor(private authService: AuthService) {
    this.usuario = this.authService.obtenerUsuario();
  }
}