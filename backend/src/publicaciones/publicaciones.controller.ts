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

import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

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

  @Get(':id')
  obtenerPublicacionPorId(@Param('id') id: string) {
    return this.publicacionesService.obtenerPublicacionPorId(id);
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