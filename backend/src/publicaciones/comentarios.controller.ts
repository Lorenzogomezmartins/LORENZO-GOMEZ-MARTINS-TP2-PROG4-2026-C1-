import {
  Body, // Permite obtener datos enviados en el cuerpo (body) de la petición HTTP
  Controller, // Decorador que define una clase como controlador de NestJS
  Get, // Decorador para rutas HTTP GET
  Param, // Permite obtener parámetros de la URL
  Post, // Decorador para rutas HTTP POST
  Put, // Decorador para rutas HTTP PUT
  Query, // Permite obtener parámetros enviados por query string
} from '@nestjs/common';

import { ComentariosService } from './comentarios.service'; // Servicio que contiene toda la lógica de negocio de comentarios
import { CrearComentarioDto } from './dto/crear-comentario.dto'; // DTO utilizado para validar la creación de comentarios
import { EditarComentarioDto } from './dto/editar-comentario.dto'; // DTO utilizado para validar la edición de comentarios

// Define el controlador base para todas las rutas que comiencen con '/publicaciones'
@Controller('publicaciones')
export class ComentariosController {

  // Inyección de dependencias del servicio ComentariosService
  constructor(private readonly comentariosService: ComentariosService) {}

  // =====================================================
  // CREAR COMENTARIO
  // POST /publicaciones/:publicacionId/comentarios
  // =====================================================

  @Post(':publicacionId/comentarios')
  async crearComentario(

    // Obtiene el ID de la publicación desde la URL
    @Param('publicacionId') publicacionId: string,

    // Obtiene y valida los datos enviados en el body mediante el DTO
    @Body() crearComentarioDto: CrearComentarioDto,

  ): Promise<unknown> {

    // Envía los datos al servicio para crear el comentario
    return await this.comentariosService.crearComentario(
      publicacionId,
      crearComentarioDto,
    );
  }

  // =====================================================
  // LISTAR COMENTARIOS DE UNA PUBLICACIÓN
  // GET /publicaciones/:publicacionId/comentarios
  // =====================================================

  @Get(':publicacionId/comentarios')
  async listarComentarios(

    // Obtiene el ID de la publicación desde la URL
    @Param('publicacionId') publicacionId: string,

    // Obtiene el offset enviado por query string
    // Ejemplo: ?offset=5
    @Query('offset') offset = '0',

    // Obtiene el límite enviado por query string
    // Ejemplo: ?limit=5
    @Query('limit') limit = '5',

  ): Promise<unknown> {

    // Convierte offset y limit de string a número
    // y los envía al servicio para realizar la paginación
    return await this.comentariosService.listarComentarios(
      publicacionId,
      Number(offset),
      Number(limit),
    );
  }

  // =====================================================
  // EDITAR COMENTARIO
  // PUT /publicaciones/comentarios/:comentarioId
  // =====================================================

  @Put('comentarios/:comentarioId')
  async editarComentario(

    // Obtiene el ID del comentario desde la URL
    @Param('comentarioId') comentarioId: string,

    // Obtiene y valida los datos enviados para editar
    @Body() editarComentarioDto: EditarComentarioDto,

  ): Promise<unknown> {

    // Envía los datos al servicio para realizar la edición
    return await this.comentariosService.editarComentario(
      comentarioId,
      editarComentarioDto,
    );
  }

  // =====================================================
  // LISTAR COMENTARIOS DE UN USUARIO
  // GET /publicaciones/comentarios/usuario/:usuarioId
  // =====================================================

  @Get('comentarios/usuario/:usuarioId')
  listarComentariosDeUsuario(

    // Obtiene el ID del usuario desde la URL
    @Param('usuarioId') usuarioId: string,

  ) {

    // Llama al servicio para obtener los comentarios realizados por ese usuario
    return this.comentariosService.listarComentariosDeUsuario(usuarioId);
  }
}