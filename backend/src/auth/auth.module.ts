import { Module } from '@nestjs/common'; // Decorador que permite definir un módulo en NestJS
import { JwtModule } from '@nestjs/jwt'; // Módulo encargado de generar y verificar tokens JWT

import { AuthController } from './auth.controller'; // Controlador que recibe las peticiones de autenticación
import { AuthService } from './auth.service'; // Servicio que contiene la lógica de registro, login y autorización
import { UsuariosModule } from '../usuarios/usuarios.module'; // Módulo de usuarios, necesario para buscar y crear usuarios

// Define este archivo como un módulo de NestJS
@Module({
  imports: [
    // Importa el módulo de usuarios para poder utilizar UsuariosService
    UsuariosModule,

    // Configuración del módulo JWT
    JwtModule.register({

      // Clave secreta utilizada para firmar y verificar los tokens
      // Primero intenta leer JWT_SECRET desde las variables de entorno (.env)
      // Si no existe, utiliza "1164" como valor por defecto
      secret: process.env.JWT_SECRET || '1164',

      // Configuración adicional de los tokens generados
      signOptions: {

        // Tiempo de expiración del token
        // En este caso, el usuario deberá renovar su token luego de 15 minutos
        expiresIn: '15m',
      },
    }),
  ],

  // Controladores que pertenecen a este módulo
  controllers: [
    AuthController,
  ],

  // Servicios que serán administrados por NestJS dentro de este módulo
  providers: [
    AuthService,
  ],
})

// Módulo encargado de toda la autenticación de la aplicación
// (registro, login, validación y renovación de tokens)
export class AuthModule {}