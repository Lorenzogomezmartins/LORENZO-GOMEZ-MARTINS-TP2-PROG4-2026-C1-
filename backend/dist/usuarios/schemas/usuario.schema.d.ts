import { HydratedDocument } from 'mongoose';
export type UsuarioDocument = HydratedDocument<Usuario>;
export declare class Usuario {
    nombre: string;
    apellido: string;
    correo: string;
    nombreUsuario: string;
    password: string;
    fechaNacimiento: string;
    descripcion: string;
    imagenPerfil: string;
    perfil: string;
    activo: boolean;
}
export declare const UsuarioSchema: import("mongoose").Schema<Usuario, import("mongoose").Model<Usuario, any, any, any, any, any, Usuario>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    nombre?: import("mongoose").SchemaDefinitionProperty<string, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    apellido?: import("mongoose").SchemaDefinitionProperty<string, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    correo?: import("mongoose").SchemaDefinitionProperty<string, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nombreUsuario?: import("mongoose").SchemaDefinitionProperty<string, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fechaNacimiento?: import("mongoose").SchemaDefinitionProperty<string, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    descripcion?: import("mongoose").SchemaDefinitionProperty<string, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    imagenPerfil?: import("mongoose").SchemaDefinitionProperty<string, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    perfil?: import("mongoose").SchemaDefinitionProperty<string, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    activo?: import("mongoose").SchemaDefinitionProperty<boolean, Usuario, import("mongoose").Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Usuario>;
