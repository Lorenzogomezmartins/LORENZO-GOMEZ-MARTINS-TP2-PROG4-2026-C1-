"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicacionesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const publicacion_schema_1 = require("./schemas/publicacion.schema");
let PublicacionesService = class PublicacionesService {
    publicacionModel;
    constructor(publicacionModel) {
        this.publicacionModel = publicacionModel;
    }
    async crearPublicacion(dto, imagenUrl) {
        const publicacion = await this.publicacionModel.create({
            titulo: dto.titulo,
            descripcion: dto.descripcion,
            imagen: imagenUrl,
            usuario: new mongoose_2.Types.ObjectId(dto.usuarioId),
            likes: [],
            activa: true,
        });
        return {
            mensaje: 'Publicación creada correctamente',
            publicacion,
        };
    }
    async listarPublicaciones(orden = 'fecha', offset = 0, limit = 5, usuarioId) {
        const filtro = { activa: true };
        if (usuarioId) {
            filtro.usuario = new mongoose_2.Types.ObjectId(usuarioId);
        }
        const sort = orden === 'likes'
            ? { cantidadLikes: -1, createdAt: -1 }
            : { createdAt: -1 };
        const publicaciones = await this.publicacionModel.aggregate([
            { $match: filtro },
            {
                $addFields: {
                    cantidadLikes: { $size: '$likes' },
                },
            },
            { $sort: sort },
            { $skip: offset },
            { $limit: limit },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuario',
                    foreignField: '_id',
                    as: 'usuario',
                },
            },
            { $unwind: '$usuario' },
            {
                $project: {
                    titulo: 1,
                    descripcion: 1,
                    imagen: 1,
                    likes: 1,
                    cantidadLikes: 1,
                    activa: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'usuario._id': 1,
                    'usuario.nombre': 1,
                    'usuario.apellido': 1,
                    'usuario.nombreUsuario': 1,
                    'usuario.imagenPerfil': 1,
                    'usuario.perfil': 1,
                },
            },
        ]);
        const total = await this.publicacionModel.countDocuments(filtro);
        return {
            publicaciones,
            total,
            offset,
            limit,
        };
    }
    async darLike(publicacionId, usuarioId) {
        const publicacion = await this.publicacionModel.findById(publicacionId);
        if (!publicacion || !publicacion.activa) {
            throw new common_1.NotFoundException('Publicación no encontrada');
        }
        const yaDioLike = publicacion.likes.some((id) => id.toString() === usuarioId);
        if (!yaDioLike) {
            publicacion.likes.push(new mongoose_2.Types.ObjectId(usuarioId));
            await publicacion.save();
        }
        return {
            mensaje: 'Like agregado correctamente',
        };
    }
    async quitarLike(publicacionId, usuarioId) {
        const publicacion = await this.publicacionModel.findById(publicacionId);
        if (!publicacion || !publicacion.activa) {
            throw new common_1.NotFoundException('Publicación no encontrada');
        }
        publicacion.likes = publicacion.likes.filter((id) => id.toString() !== usuarioId);
        await publicacion.save();
        return {
            mensaje: 'Like quitado correctamente',
        };
    }
    async eliminarPublicacion(publicacionId, usuarioId, perfil) {
        const publicacion = await this.publicacionModel.findById(publicacionId);
        if (!publicacion || !publicacion.activa) {
            throw new common_1.NotFoundException('Publicación no encontrada');
        }
        const esAutor = publicacion.usuario.toString() === usuarioId;
        const esAdmin = perfil === 'administrador';
        if (!esAutor && !esAdmin) {
            throw new common_1.ForbiddenException('No tenés permisos para eliminar esta publicación');
        }
        publicacion.activa = false;
        await publicacion.save();
        return {
            mensaje: 'Publicación eliminada correctamente',
        };
    }
};
exports.PublicacionesService = PublicacionesService;
exports.PublicacionesService = PublicacionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(publicacion_schema_1.Publicacion.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PublicacionesService);
//# sourceMappingURL=publicaciones.service.js.map