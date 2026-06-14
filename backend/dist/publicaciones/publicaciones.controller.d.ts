import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
export declare class PublicacionesController {
    private readonly publicacionesService;
    constructor(publicacionesService: PublicacionesService);
    crearPublicacion(crearPublicacionDto: CrearPublicacionDto, imagen?: Express.Multer.File): Promise<{
        mensaje: string;
        publicacion: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/publicacion.schema").Publicacion, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/publicacion.schema").Publicacion & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/publicacion.schema").Publicacion, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/publicacion.schema").Publicacion & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    listarPublicaciones(orden?: string, offset?: string, limit?: string, usuarioId?: string): Promise<{
        publicaciones: any[];
        total: number;
        offset: number;
        limit: number;
    }>;
    darLike(id: string, usuarioId: string): Promise<{
        mensaje: string;
    }>;
    quitarLike(id: string, usuarioId: string): Promise<{
        mensaje: string;
    }>;
    eliminarPublicacion(id: string, usuarioId: string, perfil: string): Promise<{
        mensaje: string;
    }>;
}
