import {
  ForbiddenException, // Excepción HTTP 403: se usa cuando el usuario no tiene permiso para hacer algo
  Injectable, // Decorador que permite que esta clase sea inyectada como servicio en NestJS
  NotFoundException, // Excepción HTTP 404: se usa cuando no se encuentra un recurso
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose'; // Permite inyectar modelos de Mongoose en servicios de NestJS
import { Model, Types } from 'mongoose'; // Model representa un modelo de MongoDB y Types permite trabajar con ObjectId

import { Comentario, ComentarioDocument } from './schemas/comentario.schema'; // Schema y tipo del documento Comentario
import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema'; // Schema y tipo del documento Publicacion
import { CrearComentarioDto } from './dto/crear-comentario.dto'; // DTO con los datos necesarios para crear un comentario
import { EditarComentarioDto } from './dto/editar-comentario.dto'; // DTO con los datos necesarios para editar un comentario

// Marca esta clase como un servicio inyectable dentro de NestJS
@Injectable()
export class ComentariosService {
  // Inyección de dependencias de los modelos de MongoDB
  constructor(
    // Inyecta el modelo Comentario para poder crear, buscar, editar y contar comentarios
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<ComentarioDocument>,

    // Inyecta el modelo Publicacion para poder verificar si existe la publicación comentada
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocument>,
  ) {}

  // Crea un comentario nuevo asociado a una publicación
  async crearComentario(publicacionId: string, dto: CrearComentarioDto) {
    // Busca la publicación por ID en la base de datos
    const publicacion = await this.publicacionModel.findById(publicacionId);

    // Si la publicación no existe o está marcada como inactiva, devuelve error 404
    if (!publicacion || !publicacion.activa) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Crea el comentario en MongoDB
    const comentario = await this.comentarioModel.create({
      mensaje: dto.mensaje, // Texto del comentario recibido desde el DTO
      usuario: new Types.ObjectId(dto.usuarioId), // ID del usuario convertido a ObjectId de MongoDB
      publicacion: new Types.ObjectId(publicacionId), // ID de la publicación convertida a ObjectId
      modificado: false, // Indica que el comentario todavía no fue editado
      activo: true, // Indica que el comentario está activo y visible
    });

    // Devuelve un mensaje de éxito junto con el comentario creado
    return {
      mensaje: 'Comentario creado correctamente',
      comentario,
    };
  }

  // Lista los comentarios de una publicación con paginación
  async listarComentarios(publicacionId: string, offset = 0, limit = 5) {
    // Filtro para traer solamente comentarios activos de una publicación específica
    const filtro = {
      publicacion: new Types.ObjectId(publicacionId),
      activo: true,
    };

    // Busca los comentarios que coincidan con el filtro
    const comentarios = await this.comentarioModel
      .find(filtro) // Busca comentarios de esa publicación y que estén activos
      .populate('usuario', 'nombre apellido nombreUsuario imagenPerfil perfil') // Trae datos básicos del usuario autor del comentario
      .sort({ createdAt: -1 }) // Ordena del más nuevo al más viejo
      .skip(offset) // Salta cierta cantidad de comentarios, usado para “cargar más”
      .limit(limit); // Limita la cantidad de comentarios devueltos

    // Cuenta el total de comentarios activos de esa publicación
    const total = await this.comentarioModel.countDocuments(filtro);

    // Devuelve los comentarios y datos útiles para la paginación
    return {
      comentarios,
      total,
      offset,
      limit,
    };
  }

  // Edita un comentario existente
  async editarComentario(comentarioId: string, dto: EditarComentarioDto) {
    // Busca el comentario por ID
    const comentario = await this.comentarioModel.findById(comentarioId);

    // Si el comentario no existe o está inactivo, devuelve error 404
    if (!comentario || !comentario.activo) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // Verifica si el usuario que intenta editar es el autor original del comentario
    const esAutor = comentario.usuario.toString() === dto.usuarioId;

    // Si no es el autor, devuelve error 403
    if (!esAutor) {
      throw new ForbiddenException('Solo podés editar tus propios comentarios');
    }

    // Actualiza el mensaje del comentario
    comentario.mensaje = dto.mensaje;

    // Marca el comentario como modificado/editado
    comentario.modificado = true;

    // Guarda los cambios en la base de datos
    await comentario.save();

    // Devuelve un mensaje de éxito junto con el comentario editado
    return {
      mensaje: 'Comentario editado correctamente',
      comentario,
    };
  }

  // Lista los últimos comentarios realizados por un usuario específico
  async listarComentariosDeUsuario(usuarioId: string) {
    // Busca comentarios activos realizados por ese usuario
    const comentarios = await this.comentarioModel
      .find({
        usuario: new Types.ObjectId(usuarioId), // Filtra por el ID del usuario
        activo: true, // Solo trae comentarios activos
      })
      .populate('usuario', 'nombre apellido nombreUsuario imagenPerfil perfil') // Trae datos básicos del usuario
      .populate('publicacion', 'titulo descripcion imagen createdAt') // Trae datos básicos de la publicación comentada
      .sort({ createdAt: -1 }) // Ordena desde el comentario más reciente al más viejo
      .limit(10); // Devuelve como máximo los últimos 10 comentarios

    // Devuelve la lista de comentarios encontrados
    return {
      comentarios,
    };
  }
}