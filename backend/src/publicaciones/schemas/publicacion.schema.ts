import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // Decoradores para definir esquemas de MongoDB
import { HydratedDocument, Types } from 'mongoose'; // Tipos de documentos y ObjectId

// Tipo que representa un documento completo de MongoDB
export type PublicacionDocument = HydratedDocument<Publicacion>;

// Crea el schema y agrega automáticamente createdAt y updatedAt
@Schema({ timestamps: true })
export class Publicacion {
  @Prop({ required: true, trim: true }) // Campo obligatorio y elimina espacios al inicio/final
  titulo!: string;

  @Prop({ required: true, trim: true }) // Campo obligatorio y elimina espacios al inicio/final
  descripcion!: string;

  @Prop({ default: '' }) // Si no se envía imagen, guarda string vacío
  imagen!: string;

  @Prop({
    type: Types.ObjectId, // Referencia a otro documento
    ref: 'Usuario', // Relacionado con la colección Usuario
    required: true,
  })
  usuario!: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Usuario' }], // Array de usuarios que dieron like
    default: [],
  })
  likes!: Types.ObjectId[];

  @Prop({ default: true }) // Se utiliza para borrado lógico
  activa!: boolean;
}

// Genera el schema de MongoDB a partir de la clase
export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
