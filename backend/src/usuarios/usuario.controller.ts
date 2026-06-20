import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioAdminDto } from './dto/crear-usuario-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  listarUsuarios() {
    return this.usuariosService.listarUsuarios();
  }

  @Post()
  crearUsuario(@Body() dto: CrearUsuarioAdminDto) {
    return this.usuariosService.crearUsuarioDesdeAdmin(dto);
  }

  @Delete(':id')
  deshabilitarUsuario(@Param('id') id: string) {
    return this.usuariosService.deshabilitarUsuario(id);
  }

  @Post(':id/habilitar')
  habilitarUsuario(@Param('id') id: string) {
    return this.usuariosService.habilitarUsuario(id);
  }
}