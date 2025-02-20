import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { Puppy, PuppySchema } from './puppies.dto';
import { PuppiesService } from './puppies.service';

describe('PuppiesService', () => {
  let service: PuppiesService;
  let puppyModel: Model<Puppy>;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const module: TestingModule = await Test.createTestingModule({
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
    await mongod.stop();
  });

  beforeEach(async () => {
    // reset database before each test
    await puppyModel.deleteMany({});
    await puppyModel.insertMany([
      {
        name: 'Buddy',
        breed: 'golden retriever',
        age: 2,
        size: 'large',
        gender: 'male',
      },
      {
        name: 'Max',
        breed: 'german shepherd',
        age: 3,
        size: 'large',
        gender: 'male',
      },
      {
        name: 'Tommy',
        breed: 'GREYHOUND',
        age: 2,
        size: 'large',
        gender: 'male',
      },
    ]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all puppies without filters', async () => {
      const result = await service.findAll({});

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Buddy');
      expect(result[1].name).toBe('Max');
      expect(result[2].name).toBe('Tommy');
    });

    it('should filter with uppercase model input', async () => {
      const result = await service.findAll({ breed: 'gREYhouND' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Tommy');
    });

    it('should filter puppies by breed', async () => {
      const result = await service.findAll({ breed: 'Golden Retriever' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Buddy');
      expect(result[0].breed).toBe('golden retriever');
    });

    it('should filter puppies by name', async () => {
      const result = await service.findAll({ search: 'Buddy' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Buddy');
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

      const result = await puppyModel.find({}).exec();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Zoe');
    });
  });
});
