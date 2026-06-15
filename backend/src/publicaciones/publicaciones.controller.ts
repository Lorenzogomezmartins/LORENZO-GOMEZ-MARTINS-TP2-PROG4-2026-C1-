import {
  Body, // Lee datos enviados en el body
  Controller, // Define una clase como controlador
  Delete, // Define rutas HTTP DELETE
  Get, // Define rutas HTTP GET
  Headers, // Lee valores enviados en los headers
  Param, // Lee parámetros de la URL
  Post, // Define rutas HTTP POST
  Query, // Lee parámetros de consulta
  UploadedFile, // Permite acceder al archivo subido
  UseInterceptors, // Permite usar interceptores como Multer
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Interceptor para recibir archivos
import { diskStorage } from 'multer'; // Configura almacenamiento en disco
import { extname } from 'path'; // Obtiene la extensión de un archivo

import { PublicacionesService } from './publicaciones.service'; // Servicio con la lógica de publicaciones
import { CrearPublicacionDto } from './dto/crear-publicacion.dto'; // DTO para crear publicaciones

// Todas las rutas de este controlador empiezan con /publicaciones
@Controller('publicaciones')
export class PublicacionesController {
  // Inyecta el servicio para delegar la lógica de negocio
  constructor(private readonly publicacionesService: PublicacionesService) {}

  // POST /publicaciones - crea una publicación con imagen opcional
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/publicaciones', // Carpeta donde se guarda la imagen

        filename: (req, file, callback) => {
          // Genera un nombre único para evitar archivos repetidos
          const nombreArchivo =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          // Guarda el archivo con su extensión original
          callback(null, nombreArchivo + extname(file.originalname));
        },
      }),
    }),
  )
  crearPublicacion(
    @Body() crearPublicacionDto: CrearPublicacionDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    // Si se subió imagen, arma la URL pública; si no, queda vacío
    const imagenUrl = imagen
      ? `http://localhost:3000/uploads/publicaciones/${imagen.filename}`
      : '';

    // Envía los datos al service para crear la publicación
    return this.publicacionesService.crearPublicacion(
      crearPublicacionDto,
      imagenUrl,
    );
  }

  // GET /publicaciones - lista publicaciones con filtros y paginación
  @Get()
  listarPublicaciones(
    @Query('orden') orden = 'fecha',
    @Query('offset') offset = '0',
    @Query('limit') limit = '5',
    @Query('usuarioId') usuarioId?: string,
  ) {
    // Convierte offset y limit a número porque llegan como string desde la URL
    return this.publicacionesService.listarPublicaciones(
      orden,
      Number(offset),
      Number(limit),
      usuarioId,
    );
  }

  // POST /publicaciones/:id/like - agrega like a una publicación
  @Post(':id/like')
  darLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.darLike(id, usuarioId);
  }

  // DELETE /publicaciones/:id/like - quita like a una publicación
  @Delete(':id/like')
  quitarLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.quitarLike(id, usuarioId);
  }

  // DELETE /publicaciones/:id - elimina una publicación
  @Delete(':id')
  eliminarPublicacion(
    @Param('id') id: string,
    @Headers('usuario-id') usuarioId: string,
    @Headers('usuario-perfil') perfil: string,
  ) {
    // Usa headers para saber quién intenta eliminar y qué permisos tiene
    return this.publicacionesService.eliminarPublicacion(id, usuarioId, perfil);
  }
}
