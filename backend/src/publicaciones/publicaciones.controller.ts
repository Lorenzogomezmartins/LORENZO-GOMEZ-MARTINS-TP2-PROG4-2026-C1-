import { Controller, Get } from '@nestjs/common';

@Controller('publicaciones')
export class PublicacionesController {
  /*
    Sprint 1 solo pide la creación del módulo Publicaciones.
    La lógica real de publicaciones empieza en Sprint 2.

    Dejamos este GET mínimo para probar que la ruta existe.
  */
  @Get()
  listarPublicacionesSprint1() {
    return {
      mensaje: 'Módulo publicaciones creado correctamente para Sprint 1',
      publicaciones: [],
    };
  }
}
