import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import cloudinary from '../cloudinary';
import * as streamifier from 'streamifier';

import { UsuariosService } from '../usuarios/usuarios.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

type JwtPayload = {
  sub: string;
  correo: string;
  nombreUsuario: string;
  perfil: string;
};

type UsuarioRespuesta = {
  _id: unknown;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcion: string;
  imagenPerfil: string;
  perfil: string;
  activo: boolean;
  password?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  private generarToken(usuario: UsuarioRespuesta): string {
    const payload: JwtPayload = {
      sub: String(usuario._id),
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      perfil: usuario.perfil,
    };

    return this.jwtService.sign(payload);
  }

  private quitarPassword(usuario: unknown): UsuarioRespuesta {
    const usuarioObj = usuario as UsuarioRespuesta;
    const { password: _password, ...usuarioSinPassword } = usuarioObj;
    void _password;
    return usuarioSinPassword;
  }

  private subirImagenCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'redsocial/perfiles',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async registrar(
    registroDto: RegistroDto,
    imagenPerfil?: Express.Multer.File,
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

    let imagenPerfilUrl = '';

    if (imagenPerfil) {
      imagenPerfilUrl = await this.subirImagenCloudinary(imagenPerfil);
    }

    const usuarioCreado = await this.usuariosService.crearUsuario({
      ...registroDto,
      correo: registroDto.correo.toLowerCase(),
      password: passwordEncriptada,
      imagenPerfil: imagenPerfilUrl,
      perfil: registroDto.perfil || 'usuario',
      activo: true,
    });

    const usuarioObj = usuarioCreado.toObject() as UsuarioRespuesta;
    const usuarioSinPassword = this.quitarPassword(usuarioObj);
    const token = this.generarToken(usuarioSinPassword);

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: usuarioSinPassword,
      token,
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

    const usuarioObj = usuario.toObject() as UsuarioRespuesta;
    const usuarioSinPassword = this.quitarPassword(usuarioObj);
    const token = this.generarToken(usuarioSinPassword);

    return {
      mensaje: 'Login correcto',
      usuario: usuarioSinPassword,
      token,
    };
  }

  async autorizar(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      const usuarioEncontrado = await this.usuariosService.buscarPorId(
        payload.sub,
      );

      if (!usuarioEncontrado) {
        throw new UnauthorizedException('Token inválido');
      }

      const usuarioObj = usuarioEncontrado.toObject() as UsuarioRespuesta;

      if (!usuarioObj.activo) {
        throw new UnauthorizedException('Usuario deshabilitado');
      }

      const usuarioSinPassword = this.quitarPassword(usuarioObj);

      return {
        mensaje: 'Token válido',
        usuario: usuarioSinPassword,
      };
    } catch {
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }

  async refrescar(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      const usuarioEncontrado = await this.usuariosService.buscarPorId(
        payload.sub,
      );

      if (!usuarioEncontrado) {
        throw new UnauthorizedException('Token inválido');
      }

      const usuarioObj = usuarioEncontrado.toObject() as UsuarioRespuesta;

      if (!usuarioObj.activo) {
        throw new UnauthorizedException('Usuario deshabilitado');
      }

      const usuarioSinPassword = this.quitarPassword(usuarioObj);
      const nuevoToken = this.generarToken(usuarioSinPassword);

      return {
        mensaje: 'Token refrescado correctamente',
        usuario: usuarioSinPassword,
        token: nuevoToken,
      };
    } catch {
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }
}