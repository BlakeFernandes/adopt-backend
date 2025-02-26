import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { puppyData } from '../database/puppies.data';
import { PuppiesController } from './puppies.controller';
import { PuppiesService } from './puppies.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PuppiesController],
  providers: [PuppiesService],
})
export class PuppiesModule implements OnModuleInit {
  constructor(private readonly puppiesService: PuppiesService) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      void this.puppiesService.seedData(puppyData);
    }
  }
}
