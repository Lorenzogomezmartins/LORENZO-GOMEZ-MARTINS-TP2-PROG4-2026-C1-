import { Injectable } from '@nestjs/common'; // Permite inyectar este servicio
import { InjectModel } from '@nestjs/mongoose'; // Permite inyectar un modelo de MongoDB
import { Model } from 'mongoose'; // Tipo base de los modelos de Mongoose

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
}
