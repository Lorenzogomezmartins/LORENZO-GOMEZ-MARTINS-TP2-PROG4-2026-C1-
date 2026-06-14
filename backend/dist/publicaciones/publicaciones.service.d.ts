import { Model, Types } from 'mongoose';
import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
export declare class PublicacionesService {
    private readonly publicacionModel;
    constructor(publicacionModel: Model<PublicacionDocument>);
    crearPublicacion(dto: CrearPublicacionDto, imagenUrl: string): Promise<{
        mensaje: string;
        publicacion: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Publicacion, {}, import("mongoose").DefaultSchemaOptions> & Publicacion & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Publicacion, {}, import("mongoose").DefaultSchemaOptions> & Publicacion & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
    listarPublicaciones(orden?: string, offset?: number, limit?: number, usuarioId?: string): Promise<{
        publicaciones: any[];
        total: number;
        offset: number;
        limit: number;
    }>;
    darLike(publicacionId: string, usuarioId: string): Promise<{
        mensaje: string;
    }>;
    quitarLike(publicacionId: string, usuarioId: string): Promise<{
        mensaje: string;
    }>;
    eliminarPublicacion(publicacionId: string, usuarioId: string, perfil: string): Promise<{
        mensaje: string;
    }>;
}
