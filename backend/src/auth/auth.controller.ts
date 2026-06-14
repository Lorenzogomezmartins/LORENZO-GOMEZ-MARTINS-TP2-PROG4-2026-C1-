import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
    POST /auth/registro

    Recibe:
    - datos del usuario por body
    - imagen de perfil por file
  */
  @Post('registro')
  @UseInterceptors(
    FileInterceptor('imagenPerfil', {
      storage: diskStorage({
        destination: './uploads',
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
    @Body() registroDto: RegistroDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    /*
      Si el usuario sube imagen, guardamos la URL.
      Si no sube imagen, queda vacío.
    */
    const imagenPerfilUrl = file
      ? `http://localhost:3000/uploads/${file.filename}`
      : '';

    return this.authService.registrar(registroDto, imagenPerfilUrl);
  }

  /*
    POST /auth/login

    Recibe correo o nombre de usuario + contraseña.
  */
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
