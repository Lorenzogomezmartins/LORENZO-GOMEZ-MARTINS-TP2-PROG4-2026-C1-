import { Module } from '@nestjs/common'; // Decorador para definir módulos de NestJS
import { MongooseModule } from '@nestjs/mongoose'; // Permite registrar modelos de MongoDB

import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema'; // Entidad y esquema de publicaciones
import { PublicacionesController } from './publicaciones.controller'; // Controlador de publicaciones
import { PublicacionesService } from './publicaciones.service'; // Servicio con la lógica de negocio

@Module({
  imports: [
    // Registra el modelo Publicacion para poder inyectarlo mediante @InjectModel()
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
  ],

  // Controladores pertenecientes a este módulo
  controllers: [PublicacionesController],

  // Servicios disponibles dentro de este módulo
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
