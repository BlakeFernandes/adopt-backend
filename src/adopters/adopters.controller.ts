import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Puppy } from 'src/database/puppies.dto';
import { AdoptersService } from './adopters.service';

export class AdoptDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsString({ message: 'Phone number is not valid' })
  phone: string;

  @IsNotEmpty({ message: 'Message is required' })
  message: string;
}

@Controller('adopt')
export class AdoptersController {
  constructor(private readonly adoptService: AdoptersService) {}

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
