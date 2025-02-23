import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Puppy } from 'src/database/puppies.dto';
import { AdoptersService } from './adopters.service';

export class AdoptDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/\S/, { message: 'Name cannot contain only spaces' })
  name: string;

  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsString({ message: 'Phone number is not valid' })
  @IsNotEmpty({ message: 'Phone cannot be empty' })
  @Matches(/\S/, { message: 'Key cannot contain only spaces' })
  phone: string;

  @IsString({ message: 'Message is not valid' })
  @IsNotEmpty({ message: 'Message is required' })
  @Matches(/\S/, { message: 'Key cannot contain only spaces' })
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
  @Post(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(
    @Param('id') id: string,
    @Body() query: AdoptDto,
  ): Promise<Puppy | null> {
    return this.adoptService.adopt({
      id: id,
      name: query.name,
      email: query.email,
      phone: query.phone,
      message: query.message,
    });
  }
}
