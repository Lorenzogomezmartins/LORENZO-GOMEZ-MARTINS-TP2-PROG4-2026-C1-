import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Publicacion, PublicacionSchema } from './schemas/publicacion.schema';
import { Comentario, ComentarioSchema } from './schemas/comentario.schema';

import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';

import { EstadisticasController } from './estadisticas/estadisticas.controller';
import { EstadisticasService } from './estadisticas/estadisticas.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Publicacion.name,
        schema: PublicacionSchema,
      },
      {
        name: Comentario.name,
        schema: ComentarioSchema,
      },
    ]),
  ],

  controllers: [
    PublicacionesController,
    EstadisticasController,
  ],

  providers: [
    PublicacionesService,
    EstadisticasService,
  ],
})
export class PublicacionesModule {}