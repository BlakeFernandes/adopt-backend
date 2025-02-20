import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Adopters } from '../database/adopters.dto';
import { Puppy } from '../database/puppies.dto';

@Injectable()
export class AdoptersService {
  constructor(
    @InjectModel(Puppy.name) private puppyModel: Model<Puppy>,
    @InjectModel(Adopters.name) private adoptersModel: Model<Adopters>,
  ) {}

  async adopt(data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<Puppy | null> {
    const puppy = await this.puppyModel.findById(data.id).exec();
    if (!puppy) return null;

    await this.adoptersModel.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      puppyId: data.id,
    });

    return puppy;
  }
}
