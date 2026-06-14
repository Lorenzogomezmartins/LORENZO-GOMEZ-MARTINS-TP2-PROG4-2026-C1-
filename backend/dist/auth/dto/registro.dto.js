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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistroDto = void 0;
const class_validator_1 = require("class-validator");
class RegistroDto {
    nombre;
    apellido;
    correo;
    nombreUsuario;
    password;
    fechaNacimiento;
    descripcion;
    perfil;
}
exports.RegistroDto = RegistroDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegistroDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El apellido es obligatorio' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegistroDto.prototype, "apellido", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo no tiene un formato válido' }),
    __metadata("design:type", String)
], RegistroDto.prototype, "correo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de usuario es obligatorio' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegistroDto.prototype, "nombreUsuario", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'La contraseña debe tener al menos una mayúscula y un número',
    }),
    __metadata("design:type", String)
], RegistroDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de nacimiento es obligatoria' }),
    __metadata("design:type", String)
], RegistroDto.prototype, "fechaNacimiento", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(250, {
        message: 'La descripción no puede superar los 250 caracteres',
    }),
    __metadata("design:type", String)
], RegistroDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['usuario', 'administrador']),
    __metadata("design:type", String)
], RegistroDto.prototype, "perfil", void 0);
//# sourceMappingURL=registro.dto.js.map