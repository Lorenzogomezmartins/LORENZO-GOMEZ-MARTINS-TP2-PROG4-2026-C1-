import {
  Body, // Permite leer datos enviados en el body de la petición
  Controller, // Define una clase como controlador
  Headers, // Permite leer headers, como Authorization
  Post, // Define rutas HTTP POST
  UploadedFile, // Permite acceder al archivo subido
  UseInterceptors, // Permite usar interceptores como el de subida de archivos
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express'; // Interceptor para recibir archivos usando Multer
import { diskStorage } from 'multer'; // Configura que el archivo se guarde físicamente en una carpeta del servidor
import { extname } from 'path'; // Permite obtener la extensión original del archivo, por ejemplo .jpg o .png

import { AuthService } from './auth.service'; // Servicio que contiene la lógica de autenticación
import { RegistroDto } from './dto/registro.dto'; // DTO que valida los datos recibidos en el registro
import { LoginDto } from './dto/login.dto'; // DTO que valida los datos recibidos en el login

// Define este controlador con la ruta base '/auth'
@Controller('auth')
export class AuthController {
  // Inyección de dependencias del servicio AuthService
  constructor(private readonly authService: AuthService) {}

  // Método privado auxiliar para obtener el token
  // Puede venir desde el header Authorization o desde el body
  private obtenerToken(authorization?: string, tokenBody?: string): string {
    // Si el header existe y empieza con "Bearer ", significa que el token viene en formato estándar
    if (authorization?.startsWith('Bearer ')) {
      // Elimina la palabra "Bearer " y devuelve solamente el token
      return authorization.replace('Bearer ', '');
    }

    // Si no vino por header, intenta devolver el token recibido en el body
    // Si tampoco existe, devuelve un string vacío
    return tokenBody || '';
  }

  // =====================================================
  // REGISTRO
  // POST /auth/registro
  // =====================================================

  @Post('registro')
  @UseInterceptors(
    // Interceptor que permite recibir un archivo desde un campo llamado 'imagenPerfil'
    FileInterceptor('imagenPerfil', {
      // Configura dónde y cómo se guarda el archivo recibido
      storage: diskStorage({
        // Carpeta donde se guardarán las imágenes subidas
        destination: './uploads',

        // Define el nombre final que tendrá el archivo guardado
        filename: (req, file, callback) => {
          // Genera un nombre único usando fecha actual + número aleatorio
          const nombreUnico =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          // Obtiene la extensión original del archivo
          // Ejemplo: foto.png → .png
          const extension = extname(file.originalname);

          // Devuelve el nombre final del archivo
          callback(null, `${nombreUnico}${extension}`);
        },
      }),
    }),
  )
  registrar(
    // Obtiene y valida los datos del body usando RegistroDto
    @Body() registroDto: RegistroDto,

    // Obtiene el archivo subido desde el campo imagenPerfil
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Si el usuario subió una imagen, se arma la URL pública para acceder a ella
    // Si no subió imagen, se guarda un string vacío
    const imagenPerfilUrl = file
      ? `http://localhost:3000/uploads/${file.filename}`
      : '';

    // Llama al servicio para registrar el usuario
    // Le pasa los datos del formulario y la URL de la imagen
    return this.authService.registrar(registroDto, imagenPerfilUrl);
  }

  // =====================================================
  // LOGIN
  // POST /auth/login
  // =====================================================

  @Post('login')
  login(
    // Obtiene y valida los datos enviados para iniciar sesión
    @Body() loginDto: LoginDto,
  ) {
    // Llama al servicio para validar usuario/contraseña y generar token
    return this.authService.login(loginDto);
  }

  // =====================================================
  // AUTORIZAR TOKEN
  // POST /auth/autorizar
  // =====================================================

  @Post('autorizar')
  autorizar(
    // Lee el header Authorization
    // Ejemplo: Authorization: Bearer eyJhbGciOi...
    @Headers('authorization') authorization: string,

    // Lee el token si viene enviado dentro del body
    @Body('token') tokenBody: string,
  ) {
    // Obtiene el token desde el header o desde el body
    const token = this.obtenerToken(authorization, tokenBody);

    // Llama al servicio para verificar si el token es válido
    return this.authService.autorizar(token);
  }

  // =====================================================
  // REFRESCAR TOKEN
  // POST /auth/refrescar
  // =====================================================

  @Post('refrescar')
  refrescar(
    // Lee el header Authorization
    @Headers('authorization') authorization: string,

    // Lee el token si viene enviado dentro del body
    @Body('token') tokenBody: string,
  ) {
    // Obtiene el token desde el header o desde el body
    const token = this.obtenerToken(authorization, tokenBody);

    // Llama al servicio para validar el token actual y generar uno nuevo
    return this.authService.refrescar(token);
  }
}