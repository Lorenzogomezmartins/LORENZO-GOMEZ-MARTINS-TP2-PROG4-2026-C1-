import {
  Body, // Permite leer datos enviados en el body
  Controller, // Define una clase como controlador
  Delete, // Define rutas HTTP DELETE
  Get, // Define rutas HTTP GET
  Param, // Permite leer parámetros de la URL
  Post, // Define rutas HTTP POST
  UseGuards, // Permite proteger rutas con guards
} from '@nestjs/common';

import { UsuariosService } from './usuarios.service'; // Servicio con la lógica de usuarios
import { CrearUsuarioAdminDto } from './dto/crear-usuario-admin.dto'; // DTO para crear usuarios desde admin

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Verifica token JWT
import { AdminGuard } from '../auth/guards/admin.guard'; // Verifica que sea administrador

// Todas las rutas comienzan con /usuarios
@Controller('usuarios')

// Protege todas las rutas del controlador
// Solo administradores pueden acceder
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsuariosController {

  // Inyección del servicio
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  // =====================================================
  // LISTAR USUARIOS
  // =====================================================

  /*
    GET /usuarios
  */
  @Get()
  listarUsuarios() {

    // Obtiene todos los usuarios
    return this.usuariosService.listarUsuarios();
  }

  // =====================================================
  // CREAR USUARIO
  // =====================================================

  /*
    POST /usuarios
  */
  @Post()
  crearUsuario(
    @Body() dto: CrearUsuarioAdminDto,
  ) {

    // Crea un usuario desde el panel administrador
    return this.usuariosService.crearUsuarioDesdeAdmin(dto);
  }

  // =====================================================
  // DESHABILITAR USUARIO
  // =====================================================

  /*
    DELETE /usuarios/:id
  */
  @Delete(':id')
  deshabilitarUsuario(
    @Param('id') id: string,
  ) {

    // Baja lógica del usuario
    return this.usuariosService.deshabilitarUsuario(id);
  }

  // =====================================================
  // HABILITAR USUARIO
  // =====================================================

  /*
    POST /usuarios/:id/habilitar
  */
  @Post(':id/habilitar')
  habilitarUsuario(
    @Param('id') id: string,
  ) {

    // Reactiva un usuario deshabilitado
    return this.usuariosService.habilitarUsuario(id);
  }
}