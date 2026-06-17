import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    private obtenerToken;
    registrar(registroDto: RegistroDto, file: Express.Multer.File): Promise<{
        mensaje: string;
        usuario: {
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
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        mensaje: string;
        usuario: {
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
        token: string;
    }>;
    autorizar(authorization: string, tokenBody: string): Promise<{
        mensaje: string;
        usuario: {
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
    }>;
    refrescar(authorization: string, tokenBody: string): Promise<{
        mensaje: string;
        usuario: {
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
        token: string;
    }>;
}
