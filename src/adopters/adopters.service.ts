import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Adopters } from '../database/adopters.dto';
import { Puppy } from '../database/puppies.dto';
import { AdoptDto } from './adopters.controller';

@Injectable()
export class AdoptersService {
  constructor(
    @InjectModel(Puppy.name) private puppyModel: Model<Puppy>,
    @InjectModel(Adopters.name) private adoptersModel: Model<Adopters>,
  ) {}

  /**
   * Save the adopter's information along with the puppy ID they want to adopt.
   *
   * @param id The ID of the puppy to adopt
   * @param name The name of the adopter
   * @param email The email of the adopter
   * @param phone The phone number of the adopter
   * @param message The message from the adopter
   * @returns The puppy that was adopted or null if the puppy was not found {@link Puppy}
   * @throws NotFoundException if the puppy is not found
   */
  async adopt(data: AdoptDto): Promise<Adopters> {
    const puppy = await this.puppyModel.findById(data.puppyId).exec();
    if (!puppy) throw new NotFoundException('Puppy not found');

    const adopter = await this.adoptersModel.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      puppyId: data.puppyId,
    });

    return adopter;
  }
}
