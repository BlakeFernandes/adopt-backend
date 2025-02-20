import { Controller, Get } from '@nestjs/common';
import { puppyData } from './puppies.data';

@Controller('puppies')
export class PuppiesController {
  @Get()
  findAll() {
    return puppyData;
  }
}
