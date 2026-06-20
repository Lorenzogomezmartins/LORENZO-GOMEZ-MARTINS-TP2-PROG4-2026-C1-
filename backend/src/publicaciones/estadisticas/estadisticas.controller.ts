import {
  Controller, // Define una clase como controlador
  Get, // Define rutas HTTP GET
  Query, // Permite leer parámetros de la URL
  UseGuards, // Permite proteger rutas con guards
} from '@nestjs/common';

import { EstadisticasService } from './estadisticas.service'; // Servicio que contiene la lógica de estadísticas

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Verifica que exista un token válido
import { AdminGuard } from '../../auth/guards/admin.guard'; // Verifica que el usuario sea administrador

// Todas las rutas comienzan con /estadisticas
@Controller('estadisticas')

// Protege todas las rutas del controlador
// Debe estar logueado y ser administrador
@UseGuards(JwtAuthGuard, AdminGuard)
export class EstadisticasController {

  // Inyección del servicio
  constructor(
    private readonly estadisticasService: EstadisticasService,
  ) {}

  // =====================================================
  // PUBLICACIONES POR USUARIO
  // =====================================================

  /*
    GET /estadisticas/publicaciones-por-usuario

    Ejemplo:
    /estadisticas/publicaciones-por-usuario?desde=2026-06-01&hasta=2026-06-30
  */
  @Get('publicaciones-por-usuario')
  publicacionesPorUsuario(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {

    // Llama al service para obtener la estadística
    return this.estadisticasService.publicacionesPorUsuario(
      desde,
      hasta,
    );
  }

  // =====================================================
  // TOTAL DE COMENTARIOS
  // =====================================================

  /*
    GET /estadisticas/comentarios-total
  */
  @Get('comentarios-total')
  comentariosTotal(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {

    // Llama al service para contar comentarios
    return this.estadisticasService.comentariosTotal(
      desde,
      hasta,
    );
  }

  // =====================================================
  // COMENTARIOS POR PUBLICACIÓN
  // =====================================================

  /*
    GET /estadisticas/comentarios-por-publicacion
  */
  @Get('comentarios-por-publicacion')
  comentariosPorPublicacion(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {

    // Llama al service para obtener publicaciones con más comentarios
    return this.estadisticasService.comentariosPorPublicacion(
      desde,
      hasta,
    );
  }
}