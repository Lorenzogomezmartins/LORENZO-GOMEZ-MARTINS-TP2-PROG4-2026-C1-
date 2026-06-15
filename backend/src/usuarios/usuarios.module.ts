import { Module } from '@nestjs/common'; // Decorador para definir módulos
import { MongooseModule } from '@nestjs/mongoose'; // Permite registrar modelos de MongoDB

import { UsuariosService } from './usuarios.service'; // Servicio de usuarios
import { Usuario, UsuarioSchema } from './schemas/usuario.schema'; // Entidad y esquema de Usuario

@Module({
  imports: [
    // Registra el modelo Usuario para poder usar @InjectModel()
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
    ]),
  ],

  // Servicios disponibles dentro del módulo
  providers: [UsuariosService],

  // Permite que otros módulos utilicen UsuariosService
  exports: [UsuariosService],
})
export class UsuariosModule {}
