import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AuthService } from '../../services/auth';
import { PublicacionesService } from '../../services/publicaciones';
import { PublicacionCard } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-mi-perfil',
  imports: [CommonModule, PublicacionCard],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.scss',
})
export class MiPerfil {
  usuarioActual: any;
  publicaciones: any[] = [];
  error = '';

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
  ) {
    this.usuarioActual = this.authService.obtenerUsuario();
    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones() {
    if (!this.usuarioActual) {
      this.error = 'No hay usuario logueado.';
      return;
    }

    this.publicacionesService
      .listarPublicaciones(
        'fecha',
        0,
        3,
        this.usuarioActual._id,
      )
      .subscribe({
        next: (resp: any) => {
          this.publicaciones = resp.publicaciones;
        },
        error: () => {
          this.error = 'No se pudieron cargar tus publicaciones.';
        },
      });
  }
}