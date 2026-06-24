import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ComentarioDocument = HydratedDocument<Comentario>;

@Schema({ timestamps: true })
export class Comentario {
  @Prop({ required: true, trim: true })
  mensaje!: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Publicacion', required: true })
  publicacion!: Types.ObjectId;

  @Prop({ default: false })
  modificado!: boolean;

  @Prop({ default: true })
  activo!: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
