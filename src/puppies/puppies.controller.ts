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
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Puppy } from '../database/puppy.dto';
import { FilterOptions, FindAllPuppy, PuppiesService } from './puppies.service';

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
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Matches(/\S/, { message: 'Name cannot contain only spaces' })
  name: string;

  @IsInt({ message: 'Age cannot be empty, should be an integer' })
  age: number;

  @IsEnum(['male', 'female', 'other'], { message: 'Gender is required' })
  gender: string;

  @IsOptional()
  isVaccinated: boolean;

  @IsOptional()
  isNeutered: boolean;

  @IsEnum(['small', 'medium', 'large'], { message: 'Size is required' })
  size: string;

  @IsString({ message: 'Breed should be a string' })
  @IsNotEmpty({ message: 'Breed cannot be empty' })
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

  /**
   * Find all puppies based on the search filter.
   *
   * @param query The search filter for puppies {@link FindAllDto}
   * @returns A list of puppies that match the search filter {@link Puppy[]}
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: FindAllDto): Promise<FindAllPuppy[]> {
    return this.puppiesService.findAll(query);
  }

  /**
   * Create a new puppy.
   *
   *
   * @param data The puppy data to create {@link CreatePuppyDto}
   * @returns The puppy that was created {@link Puppy}
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() data: CreatePuppyDto): Promise<Puppy> {
    return this.puppiesService.create(data);
  }

  /**
   * Get the filter options for puppies.
   * e.g. possible breeds, sizes
   *
   * @returns The filter options for puppies {@link FilterOptions}
   */
  @Get('filters')
  getFilters(): Promise<FilterOptions> {
    return this.puppiesService.getFilters();
  }

  /**
   * Find a puppy by ID.
   *
   * @param id The ID of the puppy to find
   * @returns The puppy that was found or null if the puppy was not found {@link Puppy}
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Puppy | null> {
    return this.puppiesService.findOne(id);
  }

  /**
   * Update a puppy by ID.
   *
   * @param id The ID of the puppy to update
   * @param data The puppy data to update {@link CreatePuppyDto}
   * @returns The puppy that was updated or null if the puppy was not found {@link Puppy}
   */
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() data: CreatePuppyDto,
  ): Promise<Puppy | null> {
    return this.puppiesService.update(id, data);
  }

  /**
   * Delete a puppy by ID.
   *
   * @param id The ID of the puppy to delete
   * @returns The puppy that was deleted or null if the puppy was not found {@link Puppy}
   */
  @Delete(':id')
  delete(@Param('id') id: string): Promise<Puppy | null> {
    return this.puppiesService.delete(id);
  }
}
