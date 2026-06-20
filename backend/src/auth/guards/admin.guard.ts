import {
  CanActivate, // Interfaz que permite crear guards
  ExecutionContext, // Permite acceder a la petición actual
  ForbiddenException, // Error 403 Forbidden
  Injectable, // Permite inyectar este guard en NestJS
} from '@nestjs/common';

// Guard encargado de verificar si el usuario es administrador
@Injectable()
export class AdminGuard implements CanActivate {

  // Se ejecuta antes de entrar a la ruta protegida
  canActivate(context: ExecutionContext): boolean {

    // Obtiene la petición HTTP actual
    const request = context.switchToHttp().getRequest();

    // Obtiene el usuario agregado previamente por JwtAuthGuard
    const usuario = request.user;

    // Si el usuario no es administrador
    if (usuario?.perfil !== 'administrador') {

      // Devuelve error 403
      throw new ForbiddenException(
        'Solo administradores',
      );
    }

    // Permite continuar hacia el controller
    return true;
  }
}