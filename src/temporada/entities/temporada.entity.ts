import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type RecetaDocument = HydratedDocument<Temporada>;

@Schema()
export class Temporada {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  temporada:number;

  @Prop({ default: Date.now })
  fechaCreacion: Date;
}

export const TemporadaSchema = SchemaFactory.createForClass(Temporada);