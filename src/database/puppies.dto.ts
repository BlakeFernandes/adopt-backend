import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PuppyDocument = HydratedDocument<Puppy>;

@Schema()
export class Puppy {
  @Prop({ required: true })
  name: string;
  @Prop()
  age: number;
  @Prop({ lowercase: true })
  gender: string;
  @Prop()
  isVaccinated: boolean;
  @Prop()
  isNeutered: boolean;
  @Prop({ lowercase: true })
  size: string;
  @Prop({ lowercase: true })
  breed: string;
  @Prop()
  traits: string[];
  @Prop()
  photoUrl: string;
}

export const PuppySchema = SchemaFactory.createForClass(Puppy);
