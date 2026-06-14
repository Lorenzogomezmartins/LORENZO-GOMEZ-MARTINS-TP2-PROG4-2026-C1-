import { UsuariosService } from '../usuarios/usuarios.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    registrar(registroDto: RegistroDto, imagenPerfilUrl: string): Promise<{
        mensaje: string;
        usuario: {
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            nombre: string;
            apellido: string;
            correo: string;
            nombreUsuario: string;
            fechaNacimiento: string;
            descripcion: string;
            imagenPerfil: string;
            perfil: string;
            activo: boolean;
            __v: number;
            id: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        mensaje: string;
        usuario: {
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            nombre: string;
            apellido: string;
            correo: string;
            nombreUsuario: string;
            fechaNacimiento: string;
            descripcion: string;
            imagenPerfil: string;
            perfil: string;
            activo: boolean;
            __v: number;
            id: string;
        };
    }>;
}
