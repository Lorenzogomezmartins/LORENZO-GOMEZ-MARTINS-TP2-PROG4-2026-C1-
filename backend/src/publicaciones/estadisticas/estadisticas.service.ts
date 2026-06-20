import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel('Publicacion')
    private readonly publicacionModel: Model<any>,

    @InjectModel('Comentario')
    private readonly comentarioModel: Model<any>,
  ) {}

  private crearFiltroFechas(desde: string, hasta: string) {
    if (!desde || !hasta) {
      throw new BadRequestException('Debe enviar fecha desde y hasta');
    }

    return {
      $gte: new Date(desde),
      $lte: new Date(hasta),
    };
  }

  publicacionesPorUsuario(desde: string, hasta: string) {
    return this.publicacionModel.aggregate([
      {
        $match: {
          activo: true,
          createdAt: this.crearFiltroFechas(desde, hasta),
        },
      },
      {
        $group: {
          _id: '$usuario',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      { $unwind: '$usuario' },
      {
        $project: {
          _id: 0,
          usuario: {
            $concat: ['$usuario.nombre', ' ', '$usuario.apellido'],
          },
          cantidad: 1,
        },
      },
    ]);
  }

  async comentariosTotal(desde: string, hasta: string) {
    const cantidad = await this.comentarioModel.countDocuments({
      activo: true,
      createdAt: this.crearFiltroFechas(desde, hasta),
    });

    return { cantidad };
  }

  comentariosPorPublicacion(desde: string, hasta: string) {
    return this.comentarioModel.aggregate([
      {
        $match: {
          activo: true,
          createdAt: this.crearFiltroFechas(desde, hasta),
        },
      },
      {
        $group: {
          _id: '$publicacion',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'publicaciones',
          localField: '_id',
          foreignField: '_id',
          as: 'publicacion',
        },
      },
      { $unwind: '$publicacion' },
      {
        $project: {
          _id: 0,
          publicacion: '$publicacion.titulo',
          cantidad: 1,
        },
      },
    ]);
  }
}