import {
  Body, // Permite leer datos enviados en el body
  Controller, // Define una clase como controlador
  Delete, // Define rutas HTTP DELETE
  Get, // Define rutas HTTP GET
  Headers, // Permite leer headers personalizados
  Param, // Permite leer parámetros de la URL
  Post, // Define rutas HTTP POST
  Query, // Permite leer query params
  UploadedFile, // Permite recibir archivos subidos
  UseInterceptors, // Permite usar interceptores como FileInterceptor
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express'; // Interceptor para recibir archivos con Multer

import { PublicacionesService } from './publicaciones.service'; // Servicio con la lógica de publicaciones
import { CrearPublicacionDto } from './dto/crear-publicacion.dto'; // DTO para validar datos de creación

// Todas las rutas comienzan con /publicaciones
@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  // Crea una publicación con imagen opcional
  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  crearPublicacion(
    @Body() crearPublicacionDto: CrearPublicacionDto,
    @UploadedFile() imagen?: any,
  ) {
    return this.publicacionesService.crearPublicacion(
      crearPublicacionDto,
      imagen,
    );
  }

  // Lista publicaciones con orden, paginación y filtro opcional por usuario
  @Get()
  listarPublicaciones(
    @Query('orden') orden = 'fecha',
    @Query('offset') offset = '0',
    @Query('limit') limit = '5',
    @Query('usuarioId') usuarioId?: string,
  ) {
    return this.publicacionesService.listarPublicaciones(
      orden,
      Number(offset),
      Number(limit),
      usuarioId,
    );
  }

  // Obtiene una publicación específica por ID
  @Get(':id')
  obtenerPublicacionPorId(@Param('id') id: string) {
    return this.publicacionesService.obtenerPublicacionPorId(id);
  }

  // Agrega like a una publicación
  @Post(':id/like')
  darLike(
    @Param('id') id: string,
    @Body('usuarioId') usuarioId: string,
  ) {
    return this.publicacionesService.darLike(id, usuarioId);
  }

  // Quita like de una publicación
  @Delete(':id/like')
  quitarLike(
    @Param('id') id: string,
    @Body('usuarioId') usuarioId: string,
  ) {
    return this.publicacionesService.quitarLike(id, usuarioId);
  }

  // Elimina una publicación si el usuario tiene permiso
  @Delete(':id')
  eliminarPublicacion(
    @Param('id') id: string,
    @Headers('usuario-id') usuarioId: string,
    @Headers('usuario-perfil') perfil: string,
  ) {
    return this.publicacionesService.eliminarPublicacion(
      id,
      usuarioId,
      perfil,
    );
  }
}