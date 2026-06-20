import {
  BadRequestException, // Error 400 para solicitudes inválidas
  Injectable, // Permite inyectar este servicio en otros componentes
  UnauthorizedException, // Error 401 para autenticación fallida
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs'; // Librería para encriptar y comparar contraseñas

import { UsuariosService } from '../usuarios/usuarios.service'; // Servicio de usuarios
import { RegistroDto } from './dto/registro.dto'; // DTO para registro
import { LoginDto } from './dto/login.dto'; // DTO para login

@Injectable()
export class AuthService {
  // Inyección de dependencias del servicio de usuarios
  constructor(private readonly usuariosService: UsuariosService) {}

  // Registra un nuevo usuario
  async registrar(registroDto: RegistroDto, imagenPerfilUrl: string) {
    // Busca si ya existe un usuario con ese correo
    const existeCorreo = await this.usuariosService.buscarPorCorreo(
      registroDto.correo,
    );

    if (existeCorreo) {
      throw new BadRequestException('Ya existe un usuario con ese correo');
    }

    // Busca si ya existe un usuario con ese nombre de usuario
    const existeNombreUsuario =
      await this.usuariosService.buscarPorNombreUsuario(
        registroDto.nombreUsuario,
      );

    if (existeNombreUsuario) {
      throw new BadRequestException(
        'Ya existe un usuario con ese nombre de usuario',
      );
    }

    // Encripta la contraseña antes de guardarla en la base de datos
    const passwordEncriptada = await bcrypt.hash(registroDto.password, 10);

    // Crea el usuario en MongoDB
    const usuarioCreado = await this.usuariosService.crearUsuario({
      ...registroDto, // Copia todas las propiedades del DTO
      correo: registroDto.correo.toLowerCase(), // Guarda el correo en minúsculas
      password: passwordEncriptada, // Guarda la contraseña encriptada
      imagenPerfil: imagenPerfilUrl,
      perfil: registroDto.perfil || 'usuario', // Si no recibe perfil usa "usuario"
      activo: true,
    });

    // Elimina la contraseña del objeto que será enviado al frontend
    const { password: _password, ...usuarioSinPassword } =
      usuarioCreado.toObject();

    // Evita advertencias de ESLint por variable sin usar
    void _password;

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: usuarioSinPassword,
    };
  }

  // Inicia sesión de un usuario
  async login(loginDto: LoginDto) {
    // Busca por correo o nombre de usuario
    const usuario = await this.usuariosService.buscarPorIdentificador(
      loginDto.identificador,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Verifica que el usuario esté habilitado
    if (!usuario) {
  throw new UnauthorizedException('Credenciales incorrectas');
}

if (!usuario.activo) {
  throw new UnauthorizedException('Tu usuario está deshabilitado');
}

    // Compara la contraseña ingresada con la almacenada en la base de datos
    const passwordValida = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Elimina la contraseña antes de devolver el usuario al frontend
    const { password: _password, ...usuarioSinPassword } = usuario.toObject();

    // Evita advertencias de ESLint por variable sin usar
    void _password;

    return {
      mensaje: 'Login correcto',
      usuario: usuarioSinPassword,
    };
  }
}
