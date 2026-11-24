import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true
  })
  customerId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'SalonService',
    required: true
  })
  serviceId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  customerName!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true })
  mobile!: string;

  @Prop({ required: true })
  appointmentDate!: string;

  @Prop({ required: true })
  appointmentTime!: string;

  @Prop({ required: true, min: 0 })
  amount!: number;

  @Prop({
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  })
  status!: string;

}

export const BookingSchema = SchemaFactory.createForClass(Booking);