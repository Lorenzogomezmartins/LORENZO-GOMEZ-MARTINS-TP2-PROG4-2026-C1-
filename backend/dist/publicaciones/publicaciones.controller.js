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
exports.PublicacionesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const publicaciones_service_1 = require("./publicaciones.service");
const crear_publicacion_dto_1 = require("./dto/crear-publicacion.dto");
let PublicacionesController = class PublicacionesController {
    publicacionesService;
    constructor(publicacionesService) {
        this.publicacionesService = publicacionesService;
    }
    crearPublicacion(crearPublicacionDto, imagen) {
        const imagenUrl = imagen
            ? `http://localhost:3000/uploads/publicaciones/${imagen.filename}`
            : '';
        return this.publicacionesService.crearPublicacion(crearPublicacionDto, imagenUrl);
    }
    listarPublicaciones(orden = 'fecha', offset = '0', limit = '5', usuarioId) {
        return this.publicacionesService.listarPublicaciones(orden, Number(offset), Number(limit), usuarioId);
    }
    darLike(id, usuarioId) {
        return this.publicacionesService.darLike(id, usuarioId);
    }
    quitarLike(id, usuarioId) {
        return this.publicacionesService.quitarLike(id, usuarioId);
    }
    eliminarPublicacion(id, usuarioId, perfil) {
        return this.publicacionesService.eliminarPublicacion(id, usuarioId, perfil);
    }
};
exports.PublicacionesController = PublicacionesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/publicaciones',
            filename: (req, file, callback) => {
                const nombreArchivo = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, nombreArchivo + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_publicacion_dto_1.CrearPublicacionDto, Object]),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "crearPublicacion", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('orden')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "listarPublicaciones", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "darLike", null);
__decorate([
    (0, common_1.Delete)(':id/like'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "quitarLike", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('usuario-id')),
    __param(2, (0, common_1.Headers)('usuario-perfil')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PublicacionesController.prototype, "eliminarPublicacion", null);
exports.PublicacionesController = PublicacionesController = __decorate([
    (0, common_1.Controller)('publicaciones'),
    __metadata("design:paramtypes", [publicaciones_service_1.PublicacionesService])
], PublicacionesController);
//# sourceMappingURL=publicaciones.controller.js.map