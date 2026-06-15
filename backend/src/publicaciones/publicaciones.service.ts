import {
  BadRequestException, // Error 400 para datos inválidos
  ForbiddenException, // Error 403 para acciones sin permiso
  Injectable, // Permite inyectar este servicio
  NotFoundException, // Error 404 cuando no se encuentra un recurso
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // Permite inyectar un modelo de Mongoose
import { Model, PipelineStage, Types } from 'mongoose'; // Tipos de Mongoose

import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema'; // Schema y documento de publicación
import { CrearPublicacionDto } from './dto/crear-publicacion.dto'; // DTO para crear publicaciones

// Tipo usado para armar el filtro de búsqueda de publicaciones
type FiltroPublicaciones = {
  activa: boolean;
  usuario?: Types.ObjectId;
};

@Injectable()
export class PublicacionesService {
  constructor(
    // Inyecta el modelo de Publicacion para trabajar con MongoDB
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocument>,
  ) {}

  // Valida que un string sea un ObjectId válido de MongoDB
  private validarObjectId(id: string, campo: string): Types.ObjectId {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${campo} inválido`);
    }

    // Convierte el string en ObjectId para poder usarlo en consultas MongoDB
    return new Types.ObjectId(id);
  }

  // Crea una nueva publicación
  async crearPublicacion(dto: CrearPublicacionDto, imagenUrl: string) {
    const publicacion = await this.publicacionModel.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      imagen: imagenUrl,
      usuario: this.validarObjectId(dto.usuarioId, 'usuarioId'),
      likes: [], // La publicación inicia sin likes
      activa: true, // Se usa borrado lógico, por eso arranca activa
    });

    return {
      mensaje: 'Publicación creada correctamente',
      publicacion,
    };
  }

  // Lista publicaciones activas con orden, paginación y filtro opcional por usuario
  async listarPublicaciones(
    orden: string = 'fecha',
    offset: number = 0,
    limit: number = 5,
    usuarioId?: string,
  ) {
    // Filtro base: solo publicaciones activas
    const filtro: FiltroPublicaciones = {
      activa: true,
    };

    // Si llega usuarioId, filtra publicaciones de ese usuario
    if (usuarioId) {
      filtro.usuario = this.validarObjectId(usuarioId, 'usuarioId');
    }

    // Define el orden: por likes o por fecha
    const sort: Record<string, 1 | -1> =
      orden === 'likes'
        ? { cantidadLikes: -1, createdAt: -1 }
        : { createdAt: -1 };

    // Pipeline de MongoDB para listar, ordenar, paginar y traer datos del usuario
    const pipeline: PipelineStage[] = [
      {
        $match: filtro, // Filtra publicaciones según el objeto filtro
      },
      {
        $addFields: {
          cantidadLikes: {
            $size: '$likes', // Calcula la cantidad de likes contando el array likes
          },
        },
      },
      {
        $sort: sort, // Ordena por likes o por fecha
      },
      {
        $skip: Number(offset), // Salta registros para paginación
      },
      {
        $limit: Number(limit), // Limita la cantidad de resultados devueltos
      },
      {
        $lookup: {
          from: 'usuarios', // Colección relacionada
          localField: 'usuario', // Campo en Publicacion
          foreignField: '_id', // Campo en Usuario
          as: 'usuario', // Nombre del campo resultante
        },
      },
      {
        $unwind: {
          path: '$usuario', // Convierte el array usuario en un objeto
          preserveNullAndEmptyArrays: true, // Mantiene la publicación aunque no encuentre usuario
        },
      },
      {
        $project: {
          titulo: 1,
          descripcion: 1,
          imagen: 1,
          likes: 1,
          cantidadLikes: 1,
          activa: 1,
          createdAt: 1,
          updatedAt: 1,
          'usuario._id': 1,
          'usuario.nombre': 1,
          'usuario.apellido': 1,
          'usuario.nombreUsuario': 1,
          'usuario.imagenPerfil': 1,
          'usuario.perfil': 1,
        },
      },
    ];

    // Ejecuta el aggregate con el pipeline definido arriba
    const publicaciones = await this.publicacionModel.aggregate(pipeline);

    // Cuenta el total de publicaciones que cumplen el filtro
    const total = await this.publicacionModel.countDocuments(filtro);

    return {
      publicaciones,
      total,
      offset: Number(offset),
      limit: Number(limit),
    };
  }

  // Agrega un like de un usuario a una publicación
  async darLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(
      this.validarObjectId(publicacionId, 'publicacionId'),
    );

    if (!publicacion || !publicacion.activa) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const usuarioObjectId = this.validarObjectId(usuarioId, 'usuarioId');

    // Verifica si el usuario ya dio like usando some()
    const yaDioLike = publicacion.likes.some(
      (id) => id.toString() === usuarioObjectId.toString(),
    );

    // Si todavía no dio like, lo agrega al array
    if (!yaDioLike) {
      publicacion.likes.push(usuarioObjectId);
      await publicacion.save();
    }

    return {
      mensaje: 'Like agregado correctamente',
    };
  }

  // Quita el like de un usuario en una publicación
  async quitarLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(
      this.validarObjectId(publicacionId, 'publicacionId'),
    );

    if (!publicacion || !publicacion.activa) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const usuarioObjectId = this.validarObjectId(usuarioId, 'usuarioId');

    // filter() crea un nuevo array sin el id del usuario
    publicacion.likes = publicacion.likes.filter(
      (id) => id.toString() !== usuarioObjectId.toString(),
    );

    await publicacion.save();

    return {
      mensaje: 'Like quitado correctamente',
    };
  }

  // Elimina una publicación mediante borrado lógico
  async eliminarPublicacion(
    publicacionId: string,
    usuarioId: string,
    perfil: string,
  ) {
    const publicacion = await this.publicacionModel.findById(
      this.validarObjectId(publicacionId, 'publicacionId'),
    );

    if (!publicacion || !publicacion.activa) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const usuarioObjectId = this.validarObjectId(usuarioId, 'usuarioId');

    // Verifica si quien quiere eliminar es el autor
    const esAutor =
      publicacion.usuario.toString() === usuarioObjectId.toString();

    // Los administradores también pueden eliminar publicaciones
    const esAdmin = perfil === 'administrador';

    if (!esAutor && !esAdmin) {
      throw new ForbiddenException(
        'No tenés permisos para eliminar esta publicación',
      );
    }

    // Borrado lógico: no se elimina de MongoDB, solo se desactiva
    publicacion.activa = false;
    await publicacion.save();

    return {
      mensaje: 'Publicación eliminada correctamente',
    };
  }
}
