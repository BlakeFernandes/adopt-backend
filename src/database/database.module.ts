import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Adopter, AdopterSchema } from './adopter.dto';
import { Puppy, PuppySchema } from './puppy.dto';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Puppy.name, schema: PuppySchema }]),
    MongooseModule.forFeature([{ name: Adopter.name, schema: AdopterSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
