import { Module } from '@nestjs/common';
import { PuppiesController } from './puppies.controller';

@Module({
  controllers: [PuppiesController],
})
export class PuppiesModule {}
