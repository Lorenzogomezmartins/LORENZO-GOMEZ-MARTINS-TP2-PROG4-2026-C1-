import {
  BadRequestException, // Error 400: datos inválidos o repetidos
  Injectable, // Permite inyectar este servicio en NestJS
  UnauthorizedException, // Error 401: credenciales incorrectas o usuario no autorizado
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs'; // Librería para encriptar y comparar contraseñas
import * as jwt from 'jsonwebtoken'; // Librería para generar tokens JWT

import { UsuariosService } from '../usuarios/usuarios.service'; // Servicio de usuarios
import { RegistroDto } from './dto/registro.dto'; // DTO del registro
import { LoginDto } from './dto/login.dto'; // DTO del login

// Servicio encargado de registro, login y generación de token
@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  // Registra un usuario nuevo
  async registrar(registroDto: RegistroDto, imagenPerfilUrl: string) {
    // Verifica si ya existe el correo
    const existeCorreo = await this.usuariosService.buscarPorCorreo(
      registroDto.correo,
    );

    if (existeCorreo) {
      throw new BadRequestException('Ya existe un usuario con ese correo');
    }

    // Verifica si ya existe el nombre de usuario
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
    const passwordEncriptada = await bcrypt.hash(registroDto.password, 10);

    // Crea el usuario en MongoDB
    const usuarioCreado = await this.usuariosService.crearUsuario({
      ...registroDto,
      correo: registroDto.correo.toLowerCase(),
      password: passwordEncriptada,
      imagenPerfil: imagenPerfilUrl,
      perfil: registroDto.perfil || 'usuario',
      activo: true,
    });

    // Quita la contraseña antes de devolver el usuario
    const { password: _password, ...usuarioSinPassword } =
      usuarioCreado.toObject();

    void _password;

    // Genera un token JWT válido por 15 minutos
    const token = jwt.sign(
      {
        id: usuarioSinPassword._id,
        correo: usuarioSinPassword.correo,
        nombreUsuario: usuarioSinPassword.nombreUsuario,
        perfil: usuarioSinPassword.perfil,
      },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '15m' },
    );

    // Devuelve usuario sin password + token
    return {
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: usuarioSinPassword,
    };
  }

  // Inicia sesión
  async login(loginDto: LoginDto) {
    // Busca por correo o nombre de usuario
    const usuario = await this.usuariosService.buscarPorIdentificador(
      loginDto.identificador,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Si el usuario está deshabilitado, no puede entrar
    if (!usuario.activo) {
      throw new UnauthorizedException('Tu usuario está deshabilitado');
    }

    // Compara la contraseña ingresada con la encriptada
    const passwordValida = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Quita la contraseña antes de responder
    const { password: _password, ...usuarioSinPassword } = usuario.toObject();

    void _password;

    // Genera token JWT válido por 15 minutos
    const token = jwt.sign(
      {
        id: usuarioSinPassword._id,
        correo: usuarioSinPassword.correo,
        nombreUsuario: usuarioSinPassword.nombreUsuario,
        perfil: usuarioSinPassword.perfil,
      },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '15m' },
    );

    return {
      mensaje: 'Login correcto',
      token,
      usuario: usuarioSinPassword,
    };
  }
}