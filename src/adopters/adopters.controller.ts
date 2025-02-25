import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Puppy } from 'src/database/puppies.dto';
import { AdoptersService } from './adopters.service';

export class AdoptDto {
  @IsString({ message: 'Puppy ID should be a string' })
  @IsNotEmpty({ message: 'Puppy ID cannot be empty' })
  @Matches(/\S/, { message: 'Puppy ID cannot contain only spaces' })
  id: string;

  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Matches(/\S/, { message: 'Name cannot contain only spaces' })
  name: string;

  @IsEmail({}, { message: 'Email should be a string' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @Matches(/\S/, { message: 'Email cannot contain only spaces' })
  email: string;

  @IsString({ message: 'Phone should be a string' })
  @IsNotEmpty({ message: 'Phone cannot be empty' })
  @Matches(/\S/, { message: 'Phone cannot contain only spaces' })
  phone: string;

  @IsString({ message: 'Message should be a string' })
  @IsNotEmpty({ message: 'Message cannot be empty' })
  @Matches(/\S/, { message: 'Message cannot contain only spaces' })
  message: string;
}

@Controller('adopters')
export class AdoptersController {
  constructor(private readonly adoptService: AdoptersService) {}

  /**
   * Save the adopter's information along with the puppy ID they want to adopt.
   *
   * @param id The ID of the puppy to adopt
   * @param query The adopter's information {@link AdoptDto}
   * @returns The puppy that was adopted or null if the puppy was not found {@link Puppy}
   * @throws NotFoundException if the puppy is not found
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Body() query: AdoptDto): Promise<Puppy | null> {
    return this.adoptService.adopt({
      id: query.id,
      name: query.name,
      email: query.email,
      phone: query.phone,
      message: query.message,
    });
  }
}
