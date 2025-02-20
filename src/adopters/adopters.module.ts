import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AdoptersController } from './adopters.controller';
import { AdoptersService } from './adopters.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdoptersController],
  providers: [AdoptersService],
})
export class AdoptModule {}
