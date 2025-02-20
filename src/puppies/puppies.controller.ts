import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { Puppy } from '../database/puppies.dto';
import { FilterOptions, PuppiesService } from './puppies.service';

export class FindAllDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  breed?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  age?: number;

  @IsOptional()
  size?: string;

  @IsOptional()
  gender?: string;
}

@Controller('puppies')
export class PuppiesController {
  constructor(private readonly puppiesService: PuppiesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: FindAllDto): Promise<Puppy[]> {
    return this.puppiesService.findAll(query);
  }

  @Get('filters')
  getFilters(): Promise<FilterOptions> {
    return this.puppiesService.getFilters();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  findOne(@Param('id') id: string): Promise<Puppy | null> {
    return this.puppiesService.findOne(id);
  }
}
