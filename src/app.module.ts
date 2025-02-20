import { Module } from '@nestjs/common';
import { PuppiesModule } from './puppies/puppies.module';

@Module({
  imports: [PuppiesModule],
})
export class AppModule {}