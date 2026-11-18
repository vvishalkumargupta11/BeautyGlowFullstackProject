import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SalonServiceDocument = HydratedDocument<SalonService>;

@Schema({ timestamps: true })
export class SalonService {

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 1 })
  duration!: number;

  @Prop({ default: '' })
  image!: string;

  @Prop({ type: [String], default: [] })
  benefits!: string[];

  @Prop({ default: true })
  isActive!: boolean;
}

export const SalonServiceSchema =
  SchemaFactory.createForClass(SalonService);