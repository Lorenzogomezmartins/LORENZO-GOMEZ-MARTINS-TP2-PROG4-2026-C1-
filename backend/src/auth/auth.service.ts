import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UsuariosService } from '../usuarios/usuarios.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async registrar(
    registroDto: RegistroDto,
    imagenPerfilUrl: string,
  ) {
    const existeCorreo = await this.usuariosService.buscarPorCorreo(
      registroDto.correo,
    );

    if (existeCorreo) {
      throw new BadRequestException('Ya existe un usuario con ese correo');
    }

    const existeNombreUsuario =
      await this.usuariosService.buscarPorNombreUsuario(
        registroDto.nombreUsuario,
      );

    if (existeNombreUsuario) {
      throw new BadRequestException(
        'Ya existe un usuario con ese nombre de usuario',
      );
    }

    const passwordEncriptada = await bcrypt.hash(registroDto.password, 10);

    const usuarioCreado = await this.usuariosService.crearUsuario({
      ...registroDto,
      correo: registroDto.correo.toLowerCase(),
      password: passwordEncriptada,
      imagenPerfil: imagenPerfilUrl,
      perfil: registroDto.perfil || 'usuario',
      activo: true,
    });

    const { password, ...usuarioSinPassword } =
      usuarioCreado.toObject();

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: usuarioSinPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.buscarPorIdentificador(
      loginDto.identificador,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario se encuentra deshabilitado');
    }

    const passwordValida = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const { password, ...usuarioSinPassword } =
    usuario.toObject();

    return {
      mensaje: 'Login correcto',
      usuario: usuarioSinPassword,
    };
  }
}
