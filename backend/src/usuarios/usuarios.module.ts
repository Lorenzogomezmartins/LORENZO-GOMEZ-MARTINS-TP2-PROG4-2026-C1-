import { Module } from '@nestjs/common'; // Decorador para definir módulos en NestJS
import { MongooseModule } from '@nestjs/mongoose'; // Permite registrar schemas de MongoDB

import { UsuariosService } from './usuarios.service'; // Servicio que contiene la lógica de usuarios
import { Usuario, UsuarioSchema } from './schemas/usuario.schema'; // Schema y clase Usuario

// Módulo encargado de la gestión de usuarios
@Module({
  imports: [
    // Registra el schema Usuario en Mongoose
    MongooseModule.forFeature([
      {
        name: Usuario.name, // Nombre del modelo
        schema: UsuarioSchema, // Schema asociado
      },
    ]),
  ],

  // Servicios disponibles dentro de este módulo
  providers: [UsuariosService],

  // Permite que otros módulos puedan usar UsuariosService
  exports: [UsuariosService],
})
export class UsuariosModule {}