import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import cloudinary from '../cloudinary';
import * as streamifier from 'streamifier';

import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';

type FiltroPublicaciones = {
  activa: boolean;
  usuario?: Types.ObjectId;
};

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocument>,
  ) {}

  private validarObjectId(id: string, campo: string): Types.ObjectId {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${campo} inválido`);
    }

    return new Types.ObjectId(id);
  }

  private subirImagenCloudinary(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'redsocial/publicaciones',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async crearPublicacion(
    dto: CrearPublicacionDto,
    imagen?: any,
  ) {
    let imagenUrl = '';

    if (imagen) {
      imagenUrl = await this.subirImagenCloudinary(imagen);
    }

    const publicacion = await this.publicacionModel.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      imagen: imagenUrl,
      usuario: this.validarObjectId(dto.usuarioId, 'usuarioId'),
      likes: [],
      activa: true,
    });

    return {
      mensaje: 'Publicación creada correctamente',
      publicacion,
    };
  }

  async listarPublicaciones(
    orden: string = 'fecha',
    offset: number = 0,
    limit: number = 5,
    usuarioId?: string,
  ) {
    const filtro: FiltroPublicaciones = {
      activa: true,
    };

    if (usuarioId) {
      filtro.usuario = this.validarObjectId(usuarioId, 'usuarioId');
    }

    const sort: Record<string, 1 | -1> =
      orden === 'likes'
        ? { cantidadLikes: -1, createdAt: -1 }
        : { createdAt: -1 };

    const pipeline: PipelineStage[] = [
      { $match: filtro },
      {
        $addFields: {
          cantidadLikes: {
            $size: '$likes',
          },
        },
      },
      { $sort: sort },
      { $skip: Number(offset) },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'usuario',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      {
        $unwind: {
          path: '$usuario',
          preserveNullAndEmptyArrays: true,
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

    const publicaciones = await this.publicacionModel.aggregate(pipeline);
    const total = await this.publicacionModel.countDocuments(filtro);

    return {
      publicaciones,
      total,
      offset: Number(offset),
      limit: Number(limit),
    };
  }

  async obtenerPublicacionPorId(id: string) {
    const publicacion = await this.publicacionModel
      .findOne({
        _id: this.validarObjectId(id, 'publicacionId'),
        activa: true,
      })
      .populate('usuario', 'nombre apellido nombreUsuario imagenPerfil perfil');

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return publicacion;
  }

  async darLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(
      this.validarObjectId(publicacionId, 'publicacionId'),
    );

    if (!publicacion || !publicacion.activa) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const usuarioObjectId = this.validarObjectId(usuarioId, 'usuarioId');

    const yaDioLike = publicacion.likes.some(
      (id) => id.toString() === usuarioObjectId.toString(),
    );

    if (!yaDioLike) {
      publicacion.likes.push(usuarioObjectId);
      await publicacion.save();
    }

    return {
      mensaje: 'Like agregado correctamente',
    };
  }

  async quitarLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(
      this.validarObjectId(publicacionId, 'publicacionId'),
    );

    if (!publicacion || !publicacion.activa) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const usuarioObjectId = this.validarObjectId(usuarioId, 'usuarioId');

    publicacion.likes = publicacion.likes.filter(
      (id) => id.toString() !== usuarioObjectId.toString(),
    );

    await publicacion.save();

    return {
      mensaje: 'Like quitado correctamente',
    };
  }

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

    const esAutor =
      publicacion.usuario.toString() === usuarioObjectId.toString();

    const esAdmin = perfil === 'administrador';

    if (!esAutor && !esAdmin) {
      throw new ForbiddenException(
        'No tenés permisos para eliminar esta publicación',
      );
    }

    publicacion.activa = false;
    await publicacion.save();

    return {
      mensaje: 'Publicación eliminada correctamente',
    };
  }
}