import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { Puppy, PuppySchema } from '../src/database/puppy.dto';
import { PuppiesService } from './../src/puppies/puppies.service';

describe('PuppiesService', () => {
  let service: PuppiesService;
  let puppyModel: Model<Puppy>;
  let mongod: MongoMemoryServer;
  let module: TestingModule;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: mongod.getUri(),
          }),
        }),
        MongooseModule.forFeature([{ name: Puppy.name, schema: PuppySchema }]),
      ],
      providers: [PuppiesService],
    }).compile();

    service = module.get<PuppiesService>(PuppiesService);
    puppyModel = module.get<Model<Puppy>>(getModelToken(Puppy.name));
  });

  afterAll(async () => {
    // Stop the in-memory MongoDB server and close the connection
    await module.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    // Reset database before each test
    await puppyModel.deleteMany({});
    await puppyModel.insertMany([
      {
        name: 'Buddy',
        age: 2,
        gender: 'male',
        isVaccinated: true,
        isNeutered: false,
        size: 'large',
        breed: 'golden retriever',
        traits: ['Friendly', 'Playful'],
        photoUrl: 'https://images.dog.ceo/breeds/doberman/n02107142_4763.jpg',
      },
      {
        name: 'Max',
        age: 3,
        gender: 'male',
        isVaccinated: true,
        isNeutered: true,
        size: 'large',
        breed: 'german shepherd',
        traits: ['Loyal', 'Intelligent'],
        photoUrl: 'https://images.dog.ceo/breeds/doberman/n02107142_4763.jpg',
      },
      {
        name: 'Tommy',
        age: 2,
        gender: 'male',
        isVaccinated: false,
        isNeutered: true,
        size: 'large',
        breed: 'GREYHOUND',
        traits: ['Fast runner', 'Gentle indoors'],
        photoUrl: 'https://images.dog.ceo/breeds/doberman/n02107142_4763.jpg',
      },
    ]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a puppy by id', async () => {
      const firstPuppy = await puppyModel.findOne({}).exec();
      expect(firstPuppy).toBeDefined();
      if (!firstPuppy) throw new Error('No puppies found');

      const puppy = await service.findOne(firstPuppy._id.toString());
      expect(puppy).toBeDefined();
      expect(puppy!.name).toBe(firstPuppy.name);
    });
  });

  describe('findAll', () => {
    it('should return all puppies without filters', async () => {
      const result = await service.findAll({});
      expect(result.puppies).toHaveLength(3);
      expect(result.puppies[0].name).toBe('Buddy');
      expect(result.puppies[1].name).toBe('Max');
      expect(result.puppies[2].name).toBe('Tommy');
      expect(result.lastPage).toBe(1);
    });

    it('should filter with uppercase model input', async () => {
      const result = await service.findAll({ breed: 'gREYhouND' });
      expect(result.puppies).toHaveLength(1);
      expect(result.puppies[0].name).toBe('Tommy');
      expect(result.lastPage).toBe(1);
    });

    it('should filter puppies by breed', async () => {
      const result = await service.findAll({ breed: 'Golden Retriever' });
      expect(result.puppies).toHaveLength(1);
      expect(result.puppies[0].name).toBe('Buddy');
      expect(result.puppies[0].breed).toBe('golden retriever');
      expect(result.lastPage).toBe(1);
    });

    it('should filter puppies by name', async () => {
      const result = await service.findAll({ search: 'Buddy' });
      expect(result.puppies).toHaveLength(1);
      expect(result.puppies[0].name).toBe('Buddy');
      expect(result.lastPage).toBe(1);
    });
  });

  describe('create', () => {
    it('should create a new puppy', async () => {
      const newPuppy = await service.create({
        name: 'Luna',
        age: 1,
        gender: 'Female',
        isVaccinated: true,
        isNeutered: false,
        size: 'small',
        breed: 'golden retriever',
        traits: ['Friendly', 'Playful'],
        photoUrl: 'https://images.dog.ceo/breeds/doberman/n02107142_4763.jpg',
      });
      expect(newPuppy).toBeDefined();
      expect(newPuppy.name).toBe('Luna');
      expect(newPuppy.age).toBe(1);
    });
  });

  describe('update', () => {
    it('should update a puppy', async () => {
      const firstPuppy = await puppyModel.findOne({}).exec();
      expect(firstPuppy).toBeDefined();
      if (!firstPuppy) throw new Error('No puppies found');

      const updatedPuppy = await service.update(firstPuppy._id.toString(), {
        name: 'Buddy Jr.',
      });
      expect(updatedPuppy).toBeDefined();
      expect(updatedPuppy!.name).toBe('Buddy Jr.');
    });
  });

  describe('delete', () => {
    it('should delete a puppy', async () => {
      const firstPuppy = await puppyModel.findOne({}).exec();
      expect(firstPuppy).toBeDefined();
      if (!firstPuppy) throw new Error('No puppies found');

      const deletedPuppy = await service.delete(firstPuppy._id.toString());
      expect(deletedPuppy).toBeDefined();
      expect(deletedPuppy!.name).toBe(firstPuppy.name);
    });
  });

  describe('getFilters', () => {
    it('should return distinct breeds', async () => {
      const result = await service.getFilters();

      expect(result.breeds).toHaveLength(3);
      expect(result.breeds).toContain('golden retriever');
      expect(result.breeds).toContain('german shepherd');
      expect(result.breeds).toContain('greyhound');
    });
  });

  describe('seedData', () => {
    it('should delete existing data and insert new data', async () => {
      // Seed new data
      // This should wipe the database...
      process.env.NODE_ENV = 'development';

      await service.seedData([
        {
          name: 'Zoe',
          age: 2,
          gender: 'female',
          isVaccinated: false,
          isNeutered: true,
          size: 'medium',
          breed: 'greyhound',
          traits: ['Fast runner', 'Gentle indoors'],
          photoUrl: 'https://images.dog.ceo/breeds/doberman/n02107142_4763.jpg',
        },
      ]);
      process.env.NODE_ENV = undefined;

      const result = await puppyModel.find({}).exec();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Zoe');
    });

    it('should should fail in production environment', async () => {
      // Seed new data
      // This should wipe the database...
      process.env.NODE_ENV = 'production';

      await expect(
        service.seedData([
          {
            name: 'Zoe',
            age: 2,
            gender: 'female',
            isVaccinated: false,
            isNeutered: true,
            size: 'medium',
            breed: 'greyhound',
            traits: ['Fast runner', 'Gentle indoors'],
            photoUrl:
              'https://images.dog.ceo/breeds/doberman/n02107142_4763.jpg',
          },
        ]),
      ).rejects.toThrow('Cannot seed data in a non-development environment');
      process.env.NODE_ENV = undefined;
    });
  });
});
