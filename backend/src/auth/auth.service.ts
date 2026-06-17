import {
  BadRequestException, // Error HTTP 400 para datos inválidos
  Injectable, // Permite inyectar este servicio en otros componentes de NestJS
  UnauthorizedException, // Error HTTP 401 para accesos no autorizados
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs'; // Librería para encriptar y comparar contraseñas

import { UsuariosService } from '../usuarios/usuarios.service'; // Servicio encargado de manejar usuarios
import { RegistroDto } from './dto/registro.dto'; // DTO con los datos del registro
import { LoginDto } from './dto/login.dto'; // DTO con los datos del login

// Servicio encargado de la autenticación
@Injectable()
export class AuthService {

  // Inyección del servicio de usuarios
  constructor(private readonly usuariosService: UsuariosService) {}

  // =====================================================
  // REGISTRO DE USUARIO
  // =====================================================

  async registrar(
    registroDto: RegistroDto,
    imagenPerfilUrl: string,
  ) {

    // Verifica si ya existe un usuario con ese correo
    const existeCorreo = await this.usuariosService.buscarPorCorreo(
      registroDto.correo,
    );

    if (existeCorreo) {
      throw new BadRequestException(
        'Ya existe un usuario con ese correo',
      );
    }

    // Verifica si ya existe ese nombre de usuario
    const existeNombreUsuario =
      await this.usuariosService.buscarPorNombreUsuario(
        registroDto.nombreUsuario,
      );

    if (existeNombreUsuario) {
      throw new BadRequestException(
        'Ya existe un usuario con ese nombre de usuario',
      );
    }

    // Encripta la contraseña antes de guardarla en MongoDB
    const passwordEncriptada =
      await bcrypt.hash(registroDto.password, 10);

    // Crea el usuario en la base de datos
    const usuarioCreado =
      await this.usuariosService.crearUsuario({
        ...registroDto,
        correo: registroDto.correo.toLowerCase(), // Guarda el correo en minúsculas
        password: passwordEncriptada, // Guarda la contraseña encriptada
        imagenPerfil: imagenPerfilUrl, // Guarda la URL de la imagen de perfil
        perfil: registroDto.perfil || 'usuario', // Perfil por defecto
        activo: true, // Usuario habilitado por defecto
      });

    // Elimina la contraseña antes de devolver el usuario al frontend
    const { password, ...usuarioSinPassword } =
      usuarioCreado.toObject();

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: usuarioSinPassword,
    };
  }

  // =====================================================
  // LOGIN
  // =====================================================

  async login(loginDto: LoginDto) {

    // Busca al usuario por correo o nombreUsuario
    const usuario =
      await this.usuariosService.buscarPorIdentificador(
        loginDto.identificador,
      );

    // Si no existe, devuelve error
    if (!usuario) {
      throw new UnauthorizedException(
        'Usuario o contraseña incorrectos',
      );
    }

    // Verifica si el usuario está habilitado
    if (!usuario.activo) {
      throw new UnauthorizedException(
        'El usuario se encuentra deshabilitado',
      );
    }

    // Compara la contraseña ingresada con la contraseña encriptada de MongoDB
    const passwordValida = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    // Si no coincide, devuelve error
    if (!passwordValida) {
      throw new UnauthorizedException(
        'Usuario o contraseña incorrectos',
      );
    }

    // Elimina la contraseña antes de devolver el usuario
    const { password, ...usuarioSinPassword } =
      usuario.toObject();

    return {
      mensaje: 'Login correcto',
      usuario: usuarioSinPassword,
    };
  }
}