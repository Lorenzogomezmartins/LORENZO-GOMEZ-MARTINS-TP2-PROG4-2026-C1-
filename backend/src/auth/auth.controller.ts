import {
  Body, // Permite obtener datos enviados en el body de la petición
  Controller, // Define una clase como controlador de NestJS
  Post, // Decorador para rutas HTTP POST
  UploadedFile, // Permite acceder al archivo subido por el usuario
  UseInterceptors, // Permite utilizar interceptores como FileInterceptor
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express'; // Interceptor para subir archivos usando Multer
import { diskStorage } from 'multer'; // Permite guardar archivos físicamente en una carpeta
import { extname } from 'path'; // Obtiene la extensión de un archivo (.jpg, .png, etc.)

import { AuthService } from './auth.service'; // Servicio con la lógica de registro y login
import { RegistroDto } from './dto/registro.dto'; // DTO que valida los datos del registro
import { LoginDto } from './dto/login.dto'; // DTO que valida los datos del login

// Todas las rutas de este controlador comienzan con /auth
@Controller('auth')
export class AuthController {

  // Inyección del servicio AuthService
  constructor(private readonly authService: AuthService) {}

  // =====================================================
  // REGISTRO
  // POST /auth/registro
  // =====================================================

  @Post('registro')
  @UseInterceptors(
    FileInterceptor('imagenPerfil', {
      storage: diskStorage({

        // Carpeta donde se guardan las imágenes
        destination: './uploads',

        // Genera un nombre único para evitar archivos duplicados
        filename: (req, file, callback) => {
          const nombreUnico =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          const extension = extname(file.originalname);

          callback(null, `${nombreUnico}${extension}`);
        },
      }),
    }),
  )
  registrar(

    // Obtiene los datos del formulario
    @Body() registroDto: RegistroDto,

    // Obtiene la imagen enviada
    @UploadedFile() file: Express.Multer.File,
  ) {

    // Genera la URL de la imagen si existe
    const imagenPerfilUrl = file
      ? `http://localhost:3000/uploads/${file.filename}`
      : '';

    // Envía los datos al servicio para registrar el usuario
    return this.authService.registrar(
      registroDto,
      imagenPerfilUrl,
    );
  }

  // =====================================================
  // LOGIN
  // POST /auth/login
  // =====================================================

  @Post('login')
  login(

    // Obtiene correo/nombreUsuario y contraseña
    @Body() loginDto: LoginDto,
  ) {

    // Envía los datos al servicio para validar credenciales
    return this.authService.login(loginDto);
  }
}