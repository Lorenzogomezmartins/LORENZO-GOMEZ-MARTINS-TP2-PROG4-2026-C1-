import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // Decoradores para crear schemas de MongoDB con NestJS
import { HydratedDocument } from 'mongoose'; // Tipo que representa un documento completo de MongoDB

// Tipo que representa un documento Usuario dentro de MongoDB
export type UsuarioDocument = HydratedDocument<Usuario>;

// Define esta clase como un schema de MongoDB
// timestamps: true agrega createdAt y updatedAt automáticamente
@Schema({ timestamps: true })
export class Usuario {

  // Nombre del usuario
  @Prop({ required: true, trim: true })
  nombre!: string;

  // Apellido del usuario
  @Prop({ required: true, trim: true })
  apellido!: string;

  // Correo electrónico único
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  correo!: string;

  // Nombre de usuario único
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  nombreUsuario!: string;

  // Contraseña encriptada
  @Prop({ required: true })
  password!: string;

  // Fecha de nacimiento
  @Prop({ required: true })
  fechaNacimiento!: string;

  // Descripción del perfil
  @Prop({
    required: true,
    maxlength: 250,
  })
  descripcion!: string;

  // URL de la imagen de perfil
  @Prop({ default: '' })
  imagenPerfil!: string;

  // Perfil del usuario
  // Puede ser "usuario" o "administrador"
  @Prop({
    enum: ['usuario', 'administrador'],
    default: 'usuario',
  })
  perfil!: string;

  // Baja lógica
  // true = puede ingresar
  // false = usuario deshabilitado
  @Prop({ default: true })
  activo!: boolean;
}

// Genera el schema de MongoDB a partir de la clase Usuario
export const UsuarioSchema =
  SchemaFactory.createForClass(Usuario);