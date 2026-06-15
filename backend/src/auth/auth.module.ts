import { Module } from '@nestjs/common'; // Decorador para definir módulos

import { AuthController } from './auth.controller'; // Controlador que recibe las peticiones de autenticación
import { AuthService } from './auth.service'; // Servicio que contiene la lógica de login y registro
import { UsuariosModule } from '../usuarios/usuarios.module'; // Módulo de usuarios

@Module({
  // Módulos que necesita AuthModule para funcionar
  imports: [UsuariosModule],

  // Controladores pertenecientes a este módulo
  controllers: [AuthController],

  // Servicios disponibles dentro de este módulo
  providers: [AuthService],
})
export class AuthModule {}
