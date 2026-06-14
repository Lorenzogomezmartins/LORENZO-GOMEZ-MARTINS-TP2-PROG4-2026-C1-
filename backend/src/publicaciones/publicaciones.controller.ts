import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/publicaciones',
        filename: (req, file, callback) => {
          const nombreArchivo =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, nombreArchivo + extname(file.originalname));
        },
      }),
    }),
  )
  crearPublicacion(
    @Body() crearPublicacionDto: CrearPublicacionDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    const imagenUrl = imagen
      ? `http://localhost:3000/uploads/publicaciones/${imagen.filename}`
      : '';

    return this.publicacionesService.crearPublicacion(
      crearPublicacionDto,
      imagenUrl,
    );
  }

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

  @Post(':id/like')
  darLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.darLike(id, usuarioId);
  }

  @Delete(':id/like')
  quitarLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.quitarLike(id, usuarioId);
  }

  @Delete(':id')
  eliminarPublicacion(
    @Param('id') id: string,
    @Headers('usuario-id') usuarioId: string,
    @Headers('usuario-perfil') perfil: string,
  ) {
    return this.publicacionesService.eliminarPublicacion(id, usuarioId, perfil);
  }
}
