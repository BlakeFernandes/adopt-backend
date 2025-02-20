import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Puppy, PuppySchema } from '../database/puppies.dto';
import { Adopters, AdoptersSchema } from './adopters.dto';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Puppy.name, schema: PuppySchema }]),
    MongooseModule.forFeature([
      { name: Adopters.name, schema: AdoptersSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
