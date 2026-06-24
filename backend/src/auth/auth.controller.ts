import {
  Body,
  Controller,
  Headers,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private obtenerToken(authorization?: string, tokenBody?: string): string {
    if (authorization?.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }

    return tokenBody || '';
  }

  @Post('registro')
@UseInterceptors(FileInterceptor('imagenPerfil'))
registrar(
  @Body() registroDto: RegistroDto,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.authService.registrar(registroDto, file);
}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('autorizar')
  autorizar(
    @Headers('authorization') authorization: string,
    @Body('token') tokenBody: string,
  ) {
    const token = this.obtenerToken(authorization, tokenBody);
    return this.authService.autorizar(token);
  }

  @Post('refrescar')
  refrescar(
    @Headers('authorization') authorization: string,
    @Body('token') tokenBody: string,
  ) {
    const token = this.obtenerToken(authorization, tokenBody);
    return this.authService.refrescar(token);
  }
}