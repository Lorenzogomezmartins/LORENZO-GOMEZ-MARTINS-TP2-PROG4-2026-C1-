import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token no enviado');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secreto',
      );

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }
}