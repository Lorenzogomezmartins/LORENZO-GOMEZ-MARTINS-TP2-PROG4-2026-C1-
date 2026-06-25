import {
  Body, // Permite leer datos enviados en el body de la petición
  Controller, // Define una clase como controlador
  Headers, // Permite leer headers, como Authorization
  Post, // Define rutas HTTP POST
  UploadedFile, // Permite acceder al archivo subido
  UseInterceptors, // Permite usar interceptores, como FileInterceptor
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express'; // Interceptor para recibir archivos con Multer

import { AuthService } from './auth.service'; // Servicio con la lógica de autenticación
import { RegistroDto } from './dto/registro.dto'; // DTO para validar datos del registro
import { LoginDto } from './dto/login.dto'; // DTO para validar datos del login

// Todas las rutas comienzan con /auth
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Obtiene el token desde el header Authorization o desde el body
  private obtenerToken(authorization?: string, tokenBody?: string): string {
    if (authorization?.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }

    return tokenBody || '';
  }

  // =====================================================
  // REGISTRO
  // POST /auth/registro
  // =====================================================

  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil'))
  registrar(
    @Body() registroDto: RegistroDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Envía los datos y la imagen al servicio
    return this.authService.registrar(registroDto, file);
  }

  // =====================================================
  // LOGIN
  // POST /auth/login
  // =====================================================

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // =====================================================
  // AUTORIZAR TOKEN
  // POST /auth/autorizar
  // =====================================================

  @Post('autorizar')
  autorizar(
    @Headers('authorization') authorization: string,
    @Body('token') tokenBody: string,
  ) {
    const token = this.obtenerToken(authorization, tokenBody);
    return this.authService.autorizar(token);
  }

  // =====================================================
  // REFRESCAR TOKEN
  // POST /auth/refrescar
  // =====================================================

  @Post('refrescar')
  refrescar(
    @Headers('authorization') authorization: string,
    @Body('token') tokenBody: string,
  ) {
    const token = this.obtenerToken(authorization, tokenBody);
    return this.authService.refrescar(token);
  }
}