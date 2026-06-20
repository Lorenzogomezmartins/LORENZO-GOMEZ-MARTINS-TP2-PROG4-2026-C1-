import { BadRequestException, Injectable } from '@nestjs/common'; // Injectable permite crear servicios y BadRequestException devuelve error 400
import { InjectModel } from '@nestjs/mongoose'; // Permite inyectar modelos de Mongoose
import { Model } from 'mongoose'; // Tipo base para trabajar con modelos de MongoDB

// Servicio encargado de generar estadísticas
@Injectable()
export class EstadisticasService {
  constructor(
    // Inyecta el modelo Publicacion para consultar publicaciones
    @InjectModel('Publicacion')
    private readonly publicacionModel: Model<any>,

    // Inyecta el modelo Comentario para consultar comentarios
    @InjectModel('Comentario')
    private readonly comentarioModel: Model<any>,
  ) {}

  // Crea un filtro de fechas para usar en consultas de MongoDB
  private crearFiltroFechas(desde: string, hasta: string) {
    // Valida que se envíen ambas fechas
    if (!desde || !hasta) {
      throw new BadRequestException('Debe enviar fecha desde y hasta');
    }

    // Convierte los textos recibidos a fechas reales
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);

    // Ajusta la fecha hasta para incluir todo el día completo
    fechaHasta.setHours(23, 59, 59, 999);

    // Devuelve el filtro para MongoDB
    return {
      $gte: fechaDesde, // Mayor o igual que fechaDesde
      $lte: fechaHasta, // Menor o igual que fechaHasta
    };
  }

  // Cuenta cuántas publicaciones hizo cada usuario en un rango de fechas
  publicacionesPorUsuario(desde: string, hasta: string) {
    return this.publicacionModel.aggregate([
      {
        // Filtra publicaciones por fecha de creación
        $match: {
          createdAt: this.crearFiltroFechas(desde, hasta),
        },
      },
      {
        // Agrupa publicaciones por usuario
        $group: {
          _id: '$usuario',
          cantidad: { $sum: 1 },
        },
      },
      {
        // Une la colección publicaciones con la colección usuarios
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      {
        // Convierte el array usuario en un objeto individual
        $unwind: {
          path: '$usuario',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // Define qué campos devolver
        $project: {
          _id: 0,
          usuario: {
            $ifNull: [
              {
                $concat: ['$usuario.nombre', ' ', '$usuario.apellido'],
              },
              'Usuario desconocido',
            ],
          },
          cantidad: 1,
        },
      },
      {
        // Ordena de mayor a menor cantidad
        $sort: {
          cantidad: -1,
        },
      },
    ]);
  }

  // Cuenta el total de comentarios activos en un rango de fechas
  async comentariosTotal(desde: string, hasta: string) {
    const cantidad = await this.comentarioModel.countDocuments({
      activo: true,
      createdAt: this.crearFiltroFechas(desde, hasta),
    });

    return { cantidad };
  }

  // Cuenta comentarios por publicación en un rango de fechas
  comentariosPorPublicacion(desde: string, hasta: string) {
    return this.comentarioModel.aggregate([
      {
        // Filtra comentarios activos por fecha
        $match: {
          activo: true,
          createdAt: this.crearFiltroFechas(desde, hasta),
        },
      },
      {
        // Agrupa comentarios por publicación
        $group: {
          _id: {
            $ifNull: ['$publicacion', '$publicacionId'],
          },
          cantidad: {
            $sum: 1,
          },
        },
      },
      {
        // Une con la colección de publicaciones
        $lookup: {
          from: 'publicacions',
          localField: '_id',
          foreignField: '_id',
          as: 'publicacion',
        },
      },
      {
        // Convierte el array publicacion en objeto
        $unwind: '$publicacion',
      },
      {
        // Devuelve solo título de publicación y cantidad
        $project: {
          _id: 0,
          publicacion: '$publicacion.titulo',
          cantidad: 1,
        },
      },
      {
        // Ordena de mayor a menor cantidad de comentarios
        $sort: {
          cantidad: -1,
        },
      },
      {
        // Devuelve solo las 4 publicaciones con más comentarios
        $limit: 4,
      },
    ]);
  }
}