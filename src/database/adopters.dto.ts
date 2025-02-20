import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdoptersDocument = HydratedDocument<Adopters>;

@Schema()
export class Adopters {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  puppyId: string;
}

export const AdoptersSchema = SchemaFactory.createForClass(Adopters);
