import {
  BadRequestException, // Excepción HTTP 400: se usa cuando los datos enviados son inválidos o ya existen
  Injectable, // Decorador que permite inyectar esta clase como servicio dentro de NestJS
  UnauthorizedException, // Excepción HTTP 401: se usa cuando el usuario no está autorizado
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt'; // Servicio de NestJS para generar, verificar y firmar tokens JWT
import * as bcrypt from 'bcryptjs'; // Librería para encriptar y comparar contraseñas

import { UsuariosService } from '../usuarios/usuarios.service'; // Servicio de usuarios, usado para buscar y crear usuarios
import { RegistroDto } from './dto/registro.dto'; // DTO que valida los datos del registro
import { LoginDto } from './dto/login.dto'; // DTO que valida los datos del login

// Define la estructura de datos que se guardará dentro del token JWT
type JwtPayload = {
  sub: string; // ID del usuario. Se usa "sub" porque en JWT suele representar el sujeto del token
  correo: string; 
  nombreUsuario: string; 
  perfil: string; 
};

// Define la estructura del usuario que se devuelve como respuesta
type UsuarioRespuesta = {
  _id: unknown; // ID del usuario generado por MongoDB
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

// Marca esta clase como servicio inyectable
@Injectable()
export class AuthService {
  // Inyección de dependencias
  constructor(
    private readonly usuariosService: UsuariosService, // Servicio para manejar usuarios en la base de datos
    private readonly jwtService: JwtService, // Servicio para crear y validar tokens JWT
  ) {}

  // Genera un token JWT a partir de los datos principales del usuario
  private generarToken(usuario: UsuarioRespuesta): string {
    // Payload: información que se guarda dentro del token
    const payload: JwtPayload = {
      sub: String(usuario._id), // Guarda el ID del usuario como string
      correo: usuario.correo, // Guarda el correo del usuario
      nombreUsuario: usuario.nombreUsuario, // Guarda el nombre de usuario
      perfil: usuario.perfil, // Guarda el perfil para saber sus permisos
    };

    // Firma y genera el token usando JwtService
    return this.jwtService.sign(payload);
  }

  // Elimina la contraseña del objeto usuario antes de devolverlo al frontend
  private quitarPassword(usuario: unknown): UsuarioRespuesta {
    // Convierte el dato recibido a tipo UsuarioRespuesta
    const usuarioObj = usuario as UsuarioRespuesta;

    // Separa la password del resto de propiedades
    const { password: _password, ...usuarioSinPassword } = usuarioObj;

    // Evita advertencias de TypeScript por declarar _password y no usarla
    void _password;

    // Devuelve el usuario sin la contraseña
    return usuarioSinPassword;
  }

  // Registra un nuevo usuario
  async registrar(registroDto: RegistroDto, imagenPerfilUrl: string) {
    // Busca si ya existe un usuario con ese correo
    const existeCorreo = await this.usuariosService.buscarPorCorreo(
      registroDto.correo,
    );

    // Si el correo ya existe, corta el registro y devuelve error 400
    if (existeCorreo) {
      throw new BadRequestException('Ya existe un usuario con ese correo');
    }

    // Busca si ya existe un usuario con ese nombre de usuario
    const existeNombreUsuario =
      await this.usuariosService.buscarPorNombreUsuario(
        registroDto.nombreUsuario,
      );

    // Si el nombre de usuario ya existe, corta el registro y devuelve error 400
    if (existeNombreUsuario) {
      throw new BadRequestException(
        'Ya existe un usuario con ese nombre de usuario',
      );
    }

    // Encripta la contraseña antes de guardarla en la base de datos
    // El número 10 representa la cantidad de rondas de salting/hash
    const passwordEncriptada = await bcrypt.hash(registroDto.password, 10);

    // Crea el usuario en la base de datos usando UsuariosService
    const usuarioCreado = await this.usuariosService.crearUsuario({
      ...registroDto, // Copia todos los datos enviados desde el registro
      correo: registroDto.correo.toLowerCase(), // Guarda el correo en minúsculas
      password: passwordEncriptada, // Guarda la contraseña ya encriptada
      imagenPerfil: imagenPerfilUrl, // Guarda la URL de la imagen subida
      perfil: registroDto.perfil || 'usuario', // Si no viene perfil, asigna "usuario" por defecto
      activo: true, // Crea el usuario activo por defecto
    });

    // Convierte el documento de Mongoose a un objeto común de JavaScript
    const usuarioObj = usuarioCreado.toObject() as UsuarioRespuesta;

    // Elimina la contraseña antes de devolver el usuario
    const usuarioSinPassword = this.quitarPassword(usuarioObj);

    // Genera un token JWT para dejar al usuario autenticado después de registrarse
    const token = this.generarToken(usuarioSinPassword);

    // Devuelve respuesta exitosa al frontend
    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: usuarioSinPassword,
      token,
    };
  }

  // Inicia sesión con correo o nombre de usuario y contraseña
  async login(loginDto: LoginDto) {
    // Busca al usuario por identificador: puede ser correo o nombreUsuario
    const usuario = await this.usuariosService.buscarPorIdentificador(
      loginDto.identificador,
    );

    // Si no existe el usuario, devuelve error 401
    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Si el usuario está deshabilitado, no permite iniciar sesión
    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario se encuentra deshabilitado');
    }

    // Compara la contraseña enviada con la contraseña encriptada guardada en MongoDB
    const passwordValida = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    // Si la contraseña no coincide, devuelve error 401
    if (!passwordValida) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Convierte el documento de Mongoose a objeto común
    const usuarioObj = usuario.toObject() as UsuarioRespuesta;

    // Elimina la contraseña antes de devolver datos al frontend
    const usuarioSinPassword = this.quitarPassword(usuarioObj);

    // Genera un token JWT para mantener la sesión del usuario
    const token = this.generarToken(usuarioSinPassword);

    // Devuelve la respuesta del login
    return {
      mensaje: 'Login correcto',
      usuario: usuarioSinPassword,
      token,
    };
  }

  // Valida si un token JWT sigue siendo correcto
  async autorizar(token: string) {
    try {
      // Verifica el token y obtiene el payload guardado dentro
      const payload = this.jwtService.verify<JwtPayload>(token);

      // Busca en la base de datos al usuario cuyo ID viene dentro del token
      const usuarioEncontrado = await this.usuariosService.buscarPorId(
        payload.sub,
      );

      // Si no existe el usuario, el token no es válido
      if (!usuarioEncontrado) {
        throw new UnauthorizedException('Token inválido');
      }

      // Convierte el documento de Mongoose a objeto común
      const usuarioObj = usuarioEncontrado.toObject() as UsuarioRespuesta;

      // Si el usuario está deshabilitado, no se autoriza
      if (!usuarioObj.activo) {
        throw new UnauthorizedException('Usuario deshabilitado');
      }

      // Quita la contraseña antes de devolver el usuario
      const usuarioSinPassword = this.quitarPassword(usuarioObj);

      // Devuelve que el token es válido
      return {
        mensaje: 'Token válido',
        usuario: usuarioSinPassword,
      };
    } catch {
      // Si el token está vencido, alterado o inválido, devuelve error 401
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }

  // Valida un token existente y genera uno nuevo
  async refrescar(token: string) {
    try {
      // Verifica el token actual
      const payload = this.jwtService.verify<JwtPayload>(token);

      // Busca al usuario en base al ID guardado en el token
      const usuarioEncontrado = await this.usuariosService.buscarPorId(
        payload.sub,
      );

      // Si el usuario no existe, el token no es válido
      if (!usuarioEncontrado) {
        throw new UnauthorizedException('Token inválido');
      }

      // Convierte el usuario de Mongoose a objeto común
      const usuarioObj = usuarioEncontrado.toObject() as UsuarioRespuesta;

      // Si el usuario está deshabilitado, no se permite refrescar el token
      if (!usuarioObj.activo) {
        throw new UnauthorizedException('Usuario deshabilitado');
      }

      // Quita la contraseña antes de devolver el usuario
      const usuarioSinPassword = this.quitarPassword(usuarioObj);

      // Genera un nuevo token JWT
      const nuevoToken = this.generarToken(usuarioSinPassword);

      // Devuelve el nuevo token al frontend
      return {
        mensaje: 'Token refrescado correctamente',
        usuario: usuarioSinPassword,
        token: nuevoToken,
      };
    } catch {
      // Si algo falla, se informa que el token no es válido o venció
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }
}