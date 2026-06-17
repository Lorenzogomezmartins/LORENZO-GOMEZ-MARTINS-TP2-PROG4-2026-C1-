import { Module } from '@nestjs/common'; // Decorador para definir módulos en NestJS

import { AuthController } from './auth.controller'; // Controlador que recibe las peticiones de login y registro
import { AuthService } from './auth.service'; // Servicio que contiene la lógica de autenticación
import { UsuariosModule } from '../usuarios/usuarios.module'; // Módulo de usuarios

// Módulo encargado de toda la autenticación
@Module({
  imports: [
    // Importa UsuariosModule para poder utilizar UsuariosService
    UsuariosModule,
  ],

  // Controladores pertenecientes a este módulo
  controllers: [
    AuthController,
  ],

  // Servicios pertenecientes a este módulo
  providers: [
    AuthService,
  ],
})
export class AuthModule {}