import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // Decoradores para definir esquemas
import { HydratedDocument } from 'mongoose'; // Tipo de documento completo de MongoDB

// Tipo que representa un documento de Usuario obtenido desde MongoDB
export type UsuarioDocument = HydratedDocument<Usuario>;

// Crea el schema y agrega automáticamente createdAt y updatedAt
@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, trim: true }) // Campo obligatorio y elimina espacios sobrantes
  nombre!: string;

  @Prop({ required: true, trim: true }) // Campo obligatorio y elimina espacios sobrantes
  apellido!: string;

  @Prop({
    required: true,
    unique: true, // No puede repetirse
    lowercase: true, // Se guarda en minúsculas
    trim: true, // Elimina espacios sobrantes
  })
  correo!: string;

  @Prop({
    required: true,
    unique: true, // No puede repetirse
    trim: true,
  })
  nombreUsuario!: string;

  @Prop({ required: true }) // Contraseña encriptada con bcrypt
  password!: string;

  @Prop({ required: true }) // Fecha de nacimiento del usuario
  fechaNacimiento!: string;

  @Prop({
    required: true,
    maxlength: 250, // Máximo 250 caracteres
  })
  descripcion!: string;

  @Prop({ default: '' }) // Imagen opcional
  imagenPerfil!: string;

  @Prop({
    enum: ['usuario', 'administrador'], // Solo permite estos valores
    default: 'usuario',
  })
  perfil!: string;

  @Prop({ default: true }) // Permite deshabilitar usuarios sin borrarlos
  activo!: boolean;
}

// Genera el schema de MongoDB a partir de la clase
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
