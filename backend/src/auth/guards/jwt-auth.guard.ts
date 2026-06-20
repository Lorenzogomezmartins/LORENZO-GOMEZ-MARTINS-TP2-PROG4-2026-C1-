import {
  CanActivate, // Interfaz para crear guards
  ExecutionContext, // Permite acceder a la petición HTTP actual
  Injectable, // Permite inyectar este guard en NestJS
  UnauthorizedException, // Error 401 Unauthorized
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken'; // Librería para validar tokens JWT

// Guard encargado de verificar que el usuario tenga un token válido
@Injectable()
export class JwtAuthGuard implements CanActivate {

  // Se ejecuta antes de entrar a una ruta protegida
  canActivate(context: ExecutionContext): boolean {

    // Obtiene la petición HTTP actual
    const request = context.switchToHttp().getRequest();

    // Obtiene el header Authorization
    const authHeader =
      request.headers.authorization;

    // Si no existe el header Authorization
    if (!authHeader) {
      throw new UnauthorizedException(
        'Token no enviado',
      );
    }

    // Extrae el token quitando "Bearer "
    const token =
      authHeader.replace('Bearer ', '');

    try {

      // Verifica que el token sea válido
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secreto',
      );

      // Guarda los datos del usuario dentro de request.user
      request.user = payload;

      // Permite continuar al controller
      return true;

    } catch {

      // Si el token es inválido o venció
      throw new UnauthorizedException(
        'Token inválido o vencido',
      );
    }
  }
}