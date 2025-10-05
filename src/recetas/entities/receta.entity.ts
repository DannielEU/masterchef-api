import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type RecetaDocument = HydratedDocument<Receta>;

@Schema()
export class Receta {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop([String])
  ingredientes: string[];

  @Prop([String])
  pasos: string[];

  @Prop()
  tiempoPreparacion: number; 

  @Prop({ type: Types.ObjectId, ref: 'Temporada', required: true })
  temporadaId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  creadoPorId?: Types.ObjectId;

  @Prop({ default: Date.now })
  fechaCreacion: Date;
}

export const RecetaSchema = SchemaFactory.createForClass(Receta);