import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Puppy } from './puppies.dto';

export type SearchFilter = {
  search?: string;
  breed?: string;
  age?: number;
  size?: string;
  gender?: string;
};

export type FilterOptions = {
  breeds: string[];
};

@Injectable()
export class PuppiesService {
  constructor(@InjectModel(Puppy.name) private puppyModel: Model<Puppy>) {}

  async findAll(filter: SearchFilter): Promise<Puppy[]> {
    const query: FilterQuery<Puppy> = {};
    const orConditions: FilterQuery<Puppy>[] = [];

    if (filter.search) {
      orConditions.push(
        { name: { $regex: filter.search, $options: 'i' } },
        { breed: { $regex: filter.search, $options: 'i' } },
      );
    }

    if (filter.breed) query.breed = filter.breed.toLowerCase();
    if (filter.age) query.age = filter.age;
    if (filter.size) query.size = filter.size.toLowerCase();
    if (filter.gender) query.gender = filter.gender.toLowerCase();

    if (orConditions.length > 0) query.$or = orConditions;

    return this.puppyModel.find(query).exec();
  }

  async getFilters(): Promise<FilterOptions> {
    const breeds = await this.puppyModel.distinct('breed').exec();
    return { breeds };
  }

  async seedData(data: Puppy[]): Promise<void> {
    await this.puppyModel.deleteMany({});
    await this.puppyModel.insertMany(data);
  }
}
