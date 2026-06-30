import { Injectable } from '@nestjs/common'; // Permite inyectar este servicio
import { InjectModel } from '@nestjs/mongoose'; // Permite inyectar un modelo de MongoDB
import { Model } from 'mongoose'; // Tipo base de los modelos de Mongoose
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CrearUsuarioAdminDto } from './dto/crear-usuario-admin.dto';

import { Usuario, UsuarioDocument } from './schemas/usuario.schema'; // Schema y documento de Usuario

@Injectable()
export class UsuariosService {
  constructor(
    // Inyecta el modelo Usuario para realizar consultas en MongoDB
    @InjectModel(Usuario.name)
    private usuarioModel: Model<UsuarioDocument>,
  ) {}

  // Busca un usuario por correo electrónico
  buscarPorCorreo(correo: string) {
    return this.usuarioModel.findOne({
      correo: correo.toLowerCase(), // Convierte a minúsculas para evitar diferencias por mayúsculas
    });
  }

  // Busca un usuario por nombre de usuario
  buscarPorNombreUsuario(nombreUsuario: string) {
    return this.usuarioModel.findOne({ nombreUsuario });
  }

  // Busca un usuario por correo o nombre de usuario
  // Se utiliza durante el login
  buscarPorIdentificador(identificador: string) {
    return this.usuarioModel.findOne({
      $or: [
        { correo: identificador.toLowerCase() },
        { nombreUsuario: identificador },
      ],
    });
  }

  // Crea y guarda un nuevo usuario en MongoDB
  crearUsuario(data: Partial<Usuario>) {
    const nuevoUsuario = new this.usuarioModel(data);

    // Guarda el documento en la base de datos
    return nuevoUsuario.save();
  }

  async listarUsuarios() {
  return this.usuarioModel
    .find()
    .select('-password')
    .sort({ createdAt: -1 });
}

async crearUsuarioDesdeAdmin(dto: CrearUsuarioAdminDto) {
  const correoExistente = await this.usuarioModel.findOne({
    correo: dto.correo,
  });

  if (correoExistente) {
    throw new BadRequestException('El correo ya está registrado');
  }

  const nombreUsuarioExistente = await this.usuarioModel.findOne({
    nombreUsuario: dto.nombreUsuario,
  });

  if (nombreUsuarioExistente) {
    throw new BadRequestException('El nombre de usuario ya está registrado');
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const nuevoUsuario = await this.usuarioModel.create({
    nombre: dto.nombre,
    apellido: dto.apellido,
    correo: dto.correo,
    nombreUsuario: dto.nombreUsuario,
    password: passwordHash,
    fechaNacimiento: dto.fechaNacimiento,
    descripcion: dto.descripcion,
    perfil: dto.perfil,
    activo: true,
  });

  const { password, ...usuarioSinPassword } = nuevoUsuario.toObject();

return usuarioSinPassword;
}

async deshabilitarUsuario(id: string) {
  const usuario = await this.usuarioModel
    .findByIdAndUpdate(id, { activo: false }, { new: true })
    .select('-password');

  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  return usuario;
}

async habilitarUsuario(id: string) {
  const usuario = await this.usuarioModel
    .findByIdAndUpdate(id, { activo: true }, { new: true })
    .select('-password');

  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  return usuario;
}
}
