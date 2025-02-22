import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
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

export class CreatePuppyDto {
  @IsString({ message: 'Name is required' })
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/\S/, { message: 'Name cannot contain only spaces' })
  name: string;

  @IsNumber({}, { message: 'Age is required' })
  age: number;

  @IsEnum(['male', 'female', 'other'], { message: 'Gender is required' })
  gender: string;

  @IsBoolean({ message: 'Vaccination status is required' })
  isVaccinated: boolean;

  @IsBoolean({ message: 'Neutering status is required' })
  isNeutered: boolean;

  @IsEnum(['small', 'medium', 'large'], { message: 'Size is required' })
  size: string;

  @IsString({ message: 'Breed is required' })
  @IsNotEmpty({ message: 'Breed is required' })
  @Matches(/\S/, { message: 'Breed cannot contain only spaces' })
  breed: string;

  @IsOptional()
  traits: string[];

  @IsOptional()
  photoUrl: string;
}

@Controller('puppies')
export class PuppiesController {
  constructor(private readonly puppiesService: PuppiesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: FindAllDto): Promise<Puppy[]> {
    return this.puppiesService.findAll(query);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() data: CreatePuppyDto): Promise<Puppy> {
    return this.puppiesService.create(data);
  }

  @Get('filters')
  getFilters(): Promise<FilterOptions> {
    return this.puppiesService.getFilters();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Puppy | null> {
    return this.puppiesService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() data: CreatePuppyDto,
  ): Promise<Puppy | null> {
    return this.puppiesService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Puppy | null> {
    return this.puppiesService.delete(id);
  }
}
