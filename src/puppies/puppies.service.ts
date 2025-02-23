import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Puppy } from '../database/puppies.dto';

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

  /**
   * Find all puppies based on the search filter.
   *
   * @param filter The filter criteria for puppies {@link FindAllDto}
   * @returns A list of puppies that match the search filter {@link Puppy[]}
   */
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

  /**
   * Get the filter options for puppies.
   * e.g. possible breeds, sizes
   *
   * @returns The filter options for puppies {@link FilterOptions}
   */
  async getFilters(): Promise<FilterOptions> {
    const breeds = await this.puppyModel.distinct('breed').exec();
    return { breeds };
  }

  /**
   * Find a puppy by ID.
   *
   * @param id The ID of the puppy to find
   * @returns The puppy that was found or null if the puppy was not found {@link Puppy}
   */
  async findOne(id: string): Promise<Puppy | null> {
    return this.puppyModel.findById(id).exec();
  }

  /**
   * Create a new puppy.
   *
   *
   * @param data The puppy to create {@link Puppy}
   * @returns The puppy that was created {@link Puppy}
   */
  async create(data: Puppy): Promise<Puppy> {
    return this.puppyModel.create(data);
  }

  /**
   * Delete a puppy by ID.
   *
   * @param id The ID of the puppy to delete
   * @returns The puppy that was deleted or null if the puppy was not found {@link Puppy}
   */
  async delete(id: string): Promise<Puppy | null> {
    return this.puppyModel.findByIdAndDelete(id).exec();
  }

  /**
   * Update a puppy by ID.
   *
   * @param id The ID of the puppy to update
   * @param data The puppy data to update {@link CreatePuppyDto}
   * @returns The puppy that was updated or null if the puppy was not found {@link Puppy}
   */
  async update(id: string, data: Partial<Puppy>): Promise<Puppy | null> {
    return this.puppyModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Seed the database with the provided data.
   *
   * @param data The puppy list to seed the database with {@link Puppy[]}
   */
  async seedData(data: Puppy[]): Promise<void> {
    await this.puppyModel.deleteMany({});
    await this.puppyModel.insertMany(data);
  }
}
