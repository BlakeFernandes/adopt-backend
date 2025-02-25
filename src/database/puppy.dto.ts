import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PuppyDocument = HydratedDocument<Puppy>;

@Schema({ timestamps: true })
export class Puppy {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  age: number;

  @Prop({ required: true, enum: ['male', 'female', 'other'], lowercase: true })
  gender: string;

  @Prop({ default: false })
  isVaccinated: boolean;

  @Prop({ default: false })
  isNeutered: boolean;

  @Prop({ required: true, enum: ['small', 'medium', 'large'], lowercase: true })
  size: string;

  @Prop({ required: true, trim: true, lowercase: true })
  breed: string;

  @Prop({ type: [String], default: [] })
  traits: string[];

  @Prop({ trim: true, match: /^https?:\/\/.+\..+/ })
  photoUrl: string;
}

export const PuppySchema = SchemaFactory.createForClass(Puppy);
