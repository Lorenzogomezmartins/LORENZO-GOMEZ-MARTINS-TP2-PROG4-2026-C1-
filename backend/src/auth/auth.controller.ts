import {
  Body, // Permite leer datos enviados en el body de la petición
  Controller, // Define una clase como controlador
  Post, // Define rutas HTTP POST
  UploadedFile, // Permite acceder al archivo subido
  UseInterceptors, // Permite usar interceptores como el de subida de archivos
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express'; // Interceptor para recibir archivos con Multer
import { diskStorage } from 'multer'; // Configura almacenamiento físico en disco
import { extname } from 'path'; // Obtiene la extensión de un archivo

import { AuthService } from './auth.service'; // Servicio con la lógica de autenticación
import { RegistroDto } from './dto/registro.dto'; // DTO para validar datos de registro
import { LoginDto } from './dto/login.dto'; // DTO para validar datos de login

// Todas las rutas de este controlador empiezan con /auth
@Controller('auth')
export class AuthController {
  // Inyecta AuthService para usar la lógica de registro y login
  constructor(private readonly authService: AuthService) {}

  // POST /auth/registro - registra un usuario y permite subir imagen de perfil
  @Post('registro')
  @UseInterceptors(
    FileInterceptor('imagenPerfil', {
      storage: diskStorage({
        destination: './uploads', // Carpeta donde se guardan las imágenes

        filename: (req, file, callback) => {
          // Genera un nombre único para evitar pisar archivos con el mismo nombre
          const nombreUnico =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          // Obtiene la extensión original del archivo, por ejemplo .jpg o .png
          const extension = extname(file.originalname);

          // Define el nombre final del archivo guardado
          callback(null, `${nombreUnico}${extension}`);
        },
      }),
    }),
  )
  registrar(
    @Body() registroDto: RegistroDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Si hay imagen, arma la URL pública; si no, deja el campo vacío
    const imagenPerfilUrl = file
      ? `https://redsocial-backend-fy2b.onrender.com/uploads/${file.filename}`
      : '';

    // Envía los datos al servicio para crear el usuario
    return this.authService.registrar(registroDto, imagenPerfilUrl);
  }

  // POST /auth/login - inicia sesión con correo/nombreUsuario y contraseña
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    // Envía los datos al servicio para validar el login
    return this.authService.login(loginDto);
  }
}
