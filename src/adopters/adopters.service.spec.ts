import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { Adopters, AdoptersSchema } from '../database/adopters.dto';
import { Puppy, PuppySchema } from '../database/puppies.dto';
import { AdoptersService } from './adopters.service';

describe('AdoptersService', () => {
  let service: AdoptersService;
  let puppyModel: Model<Puppy>;
  let adoptersModel: Model<Adopters>;
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
        MongooseModule.forFeature([
          { name: Adopters.name, schema: AdoptersSchema },
        ]),
      ],
      providers: [AdoptersService],
    }).compile();

    service = module.get<AdoptersService>(AdoptersService);
    puppyModel = module.get<Model<Puppy>>(getModelToken(Puppy.name));
    adoptersModel = module.get<Model<Adopters>>(getModelToken(Adopters.name));
  });

  afterAll(async () => {
    // Stop the in-memory MongoDB server and close the connection
    await module.close();
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

  describe('adopt', () => {
    it('should return a puppy by id', async () => {
      const firstPuppy = await puppyModel.findOne({}).exec();
      expect(firstPuppy).toBeDefined();

      if (!firstPuppy) throw new Error('No puppies found');

      const adopter = await service.adopt({
        id: firstPuppy._id.toString(),
        name: 'John Doe',
        email: 'john@doe.co.nz',
        phone: '1234567890',
        message: 'I want to adopt this puppy',
      });

      expect(adopter).toBeDefined();
      expect(adopter?.name).toBe('John Doe');
      expect(adopter?.email).toBe('john@doe.co.nz');
      expect(adopter?.phone).toBe('1234567890');
      expect(adopter?.message).toBe('I want to adopt this puppy');
    });
  });
});
