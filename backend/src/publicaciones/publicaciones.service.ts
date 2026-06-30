import {
  BadRequestException, // Error 400: se usa cuando un dato enviado es inválido
  ForbiddenException, // Error 403: se usa cuando el usuario no tiene permisos
  Injectable, // Permite inyectar este servicio en NestJS
  NotFoundException, // Error 404: se usa cuando no se encuentra un recurso
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose'; // Permite inyectar modelos de Mongoose
import { Model, PipelineStage, Types } from 'mongoose'; // Tipos de Mongoose para modelos, ObjectId y aggregations

import cloudinary from '../cloudinary'; // Configuración de Cloudinary
import * as streamifier from 'streamifier'; // Convierte buffers en streams

import {
  Publicacion,
  PublicacionDocument,
} from './schemas/publicacion.schema'; // Schema y documento de publicación

import { CrearPublicacionDto } from './dto/crear-publicacion.dto'; // DTO para crear publicaciones

// Tipo usado para filtrar publicaciones
type FiltroPublicaciones = {
  activa?: boolean;
  usuario?: Types.ObjectId;
};

// Servicio encargado de la lógica de publicaciones
@Injectable()
export class PublicacionesService {
  constructor(
    // Inyecta el modelo Publicacion para trabajar con MongoDB
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocument>,
  ) {}

  // Valida que un ID tenga formato válido de ObjectId
  private validarObjectId(id: string, campo: string): Types.ObjectId {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${campo} inválido`);
    }

    return new Types.ObjectId(id);
  }

  // Sube una imagen a Cloudinary y devuelve la URL segura
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

      // Convierte el buffer recibido por Multer en stream
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // Crea una publicación nueva
  async crearPublicacion(
    dto: CrearPublicacionDto,
    imagen?: any,
  ) {
    let imagenUrl = '';

    // Si se envió imagen, la sube a Cloudinary
    if (imagen) {
      imagenUrl = await this.subirImagenCloudinary(imagen);
    }

    // Guarda la publicación en MongoDB
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

  // Lista publicaciones activas con orden, paginación y filtro opcional por usuario
 async listarPublicaciones(
  orden: string = 'fecha',
  offset: number = 0,
  limit: number = 5,
  usuarioId?: string,
  perfil?: string,
) {
  const filtro: FiltroPublicaciones = {};

  // Si NO es administrador, solo ve publicaciones activas.
  if (perfil !== 'administrador') {
    filtro.activa = true;
  }

  // Si se envía usuarioId, filtra publicaciones de ese usuario.
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

  // Obtiene una publicación por ID
  async obtenerPublicacionPorId(id: string) {
    const publicacion = await this.publicacionModel
      .findOne({
        _id: this.validarObjectId(id, 'publicacionId'),
        activa: true,
      })
      .populate(
        'usuario',
        'nombre apellido nombreUsuario imagenPerfil perfil',
      );

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return publicacion;
  }

  // Agrega un like a una publicación
  async darLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(
      this.validarObjectId(publicacionId, 'publicacionId'),
    );

    if (!publicacion || !publicacion.activa) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const usuarioObjectId =
      this.validarObjectId(usuarioId, 'usuarioId');

    // Verifica si el usuario ya dio like
    const yaDioLike = publicacion.likes.some(
      (id) => id.toString() === usuarioObjectId.toString(),
    );

    // Si todavía no dio like, lo agrega
    if (!yaDioLike) {
      publicacion.likes.push(usuarioObjectId);
      await publicacion.save();
    }

    return {
      mensaje: 'Like agregado correctamente',
    };
  }

  // Quita el like de una publicación
  async quitarLike(publicacionId: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(
      this.validarObjectId(publicacionId, 'publicacionId'),
    );

    if (!publicacion || !publicacion.activa) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const usuarioObjectId =
      this.validarObjectId(usuarioId, 'usuarioId');

    // Filtra todos los likes excepto el del usuario actual
    publicacion.likes = publicacion.likes.filter(
      (id) => id.toString() !== usuarioObjectId.toString(),
    );

    await publicacion.save();

    return {
      mensaje: 'Like quitado correctamente',
    };
  }

  // Elimina una publicación mediante baja lógica
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

    const usuarioObjectId =
      this.validarObjectId(usuarioId, 'usuarioId');

    // Verifica si quien elimina es el autor
    const esAutor =
      publicacion.usuario.toString() === usuarioObjectId.toString();

    // Verifica si quien elimina es administrador
    const esAdmin = perfil === 'administrador';

    // Si no es autor ni admin, no tiene permiso
    if (!esAutor && !esAdmin) {
      throw new ForbiddenException(
        'No tenés permisos para eliminar esta publicación',
      );
    }

    // Baja lógica: no se borra de MongoDB, solo se marca como inactiva
    publicacion.activa = false;

    await publicacion.save();

    return {
      mensaje: 'Publicación eliminada correctamente',
    };
  }

  // Reactiva una publicación dada de baja.
// Solo un administrador puede hacerlo.
async activarPublicacion(
  publicacionId: string,
  usuarioId: string,
  perfil: string,
) {
  const publicacion = await this.publicacionModel.findById(
    this.validarObjectId(publicacionId, 'publicacionId'),
  );

  if (!publicacion) {
    throw new NotFoundException('Publicación no encontrada');
  }

  if (perfil !== 'administrador') {
    throw new ForbiddenException(
      'Solo un administrador puede activar publicaciones',
    );
  }

  this.validarObjectId(usuarioId, 'usuarioId');

  publicacion.activa = true;

  await publicacion.save();

  return {
    mensaje: 'Publicación activada correctamente',
  };
}
}