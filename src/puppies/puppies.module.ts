import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PuppiesController } from './puppies.controller';
import { puppyData } from './puppies.data';
import { Puppy, PuppySchema } from './puppies.dto';
import { PuppiesService } from './puppies.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Puppy.name, schema: PuppySchema }]),
  ],
  controllers: [PuppiesController],
  providers: [PuppiesService],
})
export class PuppiesModule {
  constructor(private readonly puppiesService: PuppiesService) {}

  onModuleInit() {
    void this.puppiesService.seedData(puppyData);
  }
}
