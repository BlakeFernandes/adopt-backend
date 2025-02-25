import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdopterDocument = HydratedDocument<Adopter>;

@Schema({ timestamps: true })
export class Adopter {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email: string;

  @Prop({ required: true, trim: true, match: /^\+?[1-9]\d{1,14}$/ })
  phone: string;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 500 })
  message: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Puppy' })
  puppyId: string;
}

export const AdopterSchema = SchemaFactory.createForClass(Adopter);
