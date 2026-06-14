import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<UsuarioDocument>,
  ) {}

  /*
    Busca un usuario por correo.
  */
  buscarPorCorreo(correo: string) {
    return this.usuarioModel.findOne({ correo: correo.toLowerCase() });
  }

  /*
    Busca un usuario por nombre de usuario.
  */
  buscarPorNombreUsuario(nombreUsuario: string) {
    return this.usuarioModel.findOne({ nombreUsuario });
  }

  /*
    Busca por correo o nombre de usuario.
    Lo usamos en login.
  */
  buscarPorIdentificador(identificador: string) {
    return this.usuarioModel.findOne({
      $or: [
        { correo: identificador.toLowerCase() },
        { nombreUsuario: identificador },
      ],
    });
  }

  /*
    Crea el usuario en MongoDB.
  */
  crearUsuario(data: Partial<Usuario>) {
    const nuevoUsuario = new this.usuarioModel(data);
    return nuevoUsuario.save();
  }
}
