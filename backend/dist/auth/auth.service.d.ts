import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
type UsuarioRespuesta = {
    _id: unknown;
    nombre: string;
    apellido: string;
    correo: string;
    nombreUsuario: string;
    fechaNacimiento: string;
    descripcion: string;
    imagenPerfil: string;
    perfil: string;
    activo: boolean;
    password?: string;
};
export declare class AuthService {
    private readonly usuariosService;
    private readonly jwtService;
    constructor(usuariosService: UsuariosService, jwtService: JwtService);
    private generarToken;
    private quitarPassword;
    registrar(registroDto: RegistroDto, imagenPerfilUrl: string): Promise<{
        mensaje: string;
        usuario: UsuarioRespuesta;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        mensaje: string;
        usuario: UsuarioRespuesta;
        token: string;
    }>;
    autorizar(token: string): Promise<{
        mensaje: string;
        usuario: UsuarioRespuesta;
    }>;
    refrescar(token: string): Promise<{
        mensaje: string;
        usuario: UsuarioRespuesta;
        token: string;
    }>;
}
export {};
