import {
  BadRequestException, // Error 400: datos inválidos o repetidos
  Injectable, // Permite inyectar este servicio en NestJS
  UnauthorizedException, // Error 401: usuario no autorizado
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt'; // Servicio de NestJS para generar y verificar JWT
import * as bcrypt from 'bcryptjs'; // Librería para encriptar y comparar contraseñas
import cloudinary from '../cloudinary'; // Configuración de Cloudinary para subir imágenes
import * as streamifier from 'streamifier'; // Convierte un buffer en stream para subirlo a Cloudinary

import { UsuariosService } from '../usuarios/usuarios.service'; // Servicio de usuarios
import { RegistroDto } from './dto/registro.dto'; // DTO del registro
import { LoginDto } from './dto/login.dto'; // DTO del login

// Datos que se guardan dentro del token JWT
type JwtPayload = {
  sub: string;
  correo: string;
  nombreUsuario: string;
  perfil: string;
};

// Estructura del usuario que se devuelve al frontend
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

// Servicio encargado de autenticación
@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  // Genera un token JWT con datos básicos del usuario
  private generarToken(usuario: UsuarioRespuesta): string {
    const payload: JwtPayload = {
      sub: String(usuario._id),
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      perfil: usuario.perfil,
    };

    return this.jwtService.sign(payload);
  }

  // Quita la contraseña antes de devolver el usuario
  private quitarPassword(usuario: unknown): UsuarioRespuesta {
    const usuarioObj = usuario as UsuarioRespuesta;
    const { password: _password, ...usuarioSinPassword } = usuarioObj;

    void _password;

    return usuarioSinPassword;
  }

  // Sube una imagen de perfil a Cloudinary y devuelve la URL segura
  private subirImagenCloudinary(
    file: Express.Multer.File,
  ): Promise<string> {
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

      // Convierte el buffer de Multer en stream y lo envía a Cloudinary
      streamifier
        .createReadStream(file.buffer)
        .pipe(uploadStream);
    });
  }

  // Registra un usuario nuevo
  async registrar(
    registroDto: RegistroDto,
    imagenPerfil?: Express.Multer.File,
  ) {
    // Verifica si el correo ya está registrado
    const existeCorreo = await this.usuariosService.buscarPorCorreo(
      registroDto.correo,
    );

    if (existeCorreo) {
      throw new BadRequestException('Ya existe un usuario con ese correo');
    }

    // Verifica si el nombre de usuario ya está registrado
    const existeNombreUsuario =
      await this.usuariosService.buscarPorNombreUsuario(
        registroDto.nombreUsuario,
      );

    if (existeNombreUsuario) {
      throw new BadRequestException(
        'Ya existe un usuario con ese nombre de usuario',
      );
    }

    // Encripta la contraseña antes de guardarla
    const passwordEncriptada = await bcrypt.hash(
      registroDto.password,
      10,
    );

    // URL de imagen por defecto vacía
    let imagenPerfilUrl = '';

    // Si se subió imagen, la guarda en Cloudinary
    if (imagenPerfil) {
      imagenPerfilUrl =
        await this.subirImagenCloudinary(imagenPerfil);
    }

    // Crea el usuario en MongoDB
    const usuarioCreado =
      await this.usuariosService.crearUsuario({
        ...registroDto,
        correo: registroDto.correo.toLowerCase(),
        password: passwordEncriptada,
        imagenPerfil: imagenPerfilUrl,
        perfil: registroDto.perfil || 'usuario',
        activo: true,
      });

    // Convierte el documento de Mongoose a objeto normal
    const usuarioObj =
      usuarioCreado.toObject() as UsuarioRespuesta;

    // Quita password antes de responder
    const usuarioSinPassword =
      this.quitarPassword(usuarioObj);

    // Genera token para iniciar sesión automáticamente
    const token =
      this.generarToken(usuarioSinPassword);

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: usuarioSinPassword,
      token,
    };
  }

  // Inicia sesión
  async login(loginDto: LoginDto) {
    // Busca por correo o nombre de usuario
    const usuario =
      await this.usuariosService.buscarPorIdentificador(
        loginDto.identificador,
      );

    if (!usuario) {
      throw new UnauthorizedException(
        'Usuario o contraseña incorrectos',
      );
    }

    // Si está deshabilitado, no puede iniciar sesión
    if (!usuario.activo) {
      throw new UnauthorizedException(
        'El usuario se encuentra deshabilitado',
      );
    }

    // Compara la contraseña ingresada con la guardada en MongoDB
    const passwordValida = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    if (!passwordValida) {
      throw new UnauthorizedException(
        'Usuario o contraseña incorrectos',
      );
    }

    // Quita password
    const usuarioObj =
      usuario.toObject() as UsuarioRespuesta;

    const usuarioSinPassword =
      this.quitarPassword(usuarioObj);

    // Genera token JWT
    const token =
      this.generarToken(usuarioSinPassword);

    return {
      mensaje: 'Login correcto',
      usuario: usuarioSinPassword,
      token,
    };
  }

  // Verifica si un token sigue siendo válido
  async autorizar(token: string) {
    try {
      const payload =
        this.jwtService.verify<JwtPayload>(token);

      const usuarioEncontrado =
        await this.usuariosService.buscarPorId(payload.sub);

      if (!usuarioEncontrado) {
        throw new UnauthorizedException('Token inválido');
      }

      const usuarioObj =
        usuarioEncontrado.toObject() as UsuarioRespuesta;

      if (!usuarioObj.activo) {
        throw new UnauthorizedException('Usuario deshabilitado');
      }

      const usuarioSinPassword =
        this.quitarPassword(usuarioObj);

      return {
        mensaje: 'Token válido',
        usuario: usuarioSinPassword,
      };
    } catch {
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }

  // Genera un token nuevo a partir de uno válido
  async refrescar(token: string) {
    try {
      const payload =
        this.jwtService.verify<JwtPayload>(token);

      const usuarioEncontrado =
        await this.usuariosService.buscarPorId(payload.sub);

      if (!usuarioEncontrado) {
        throw new UnauthorizedException('Token inválido');
      }

      const usuarioObj =
        usuarioEncontrado.toObject() as UsuarioRespuesta;

      if (!usuarioObj.activo) {
        throw new UnauthorizedException('Usuario deshabilitado');
      }

      const usuarioSinPassword =
        this.quitarPassword(usuarioObj);

      const nuevoToken =
        this.generarToken(usuarioSinPassword);

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