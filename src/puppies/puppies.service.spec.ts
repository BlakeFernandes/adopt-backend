import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PuppiesService } from './puppies.service';

describe('PuppiesService', () => {
  let service: PuppiesService;

  const mockedPuppyModel = {
    find: jest.fn().mockReturnThis(),
    distinct: jest.fn(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuppiesService,
        { provide: getModelToken('Puppy'), useValue: mockedPuppyModel },
      ],
    }).compile();

    service = module.get<PuppiesService>(PuppiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of puppies', async () => {
      const mockFindAllResponse = [
        {
          name: 'Buddy',
          age: 2,
          breed: 'Golden Retriever',
          traits: ['friendly', 'playful'],
          photoUrl: 'https://example.com/buddy.jpg',
        },
      ];

      mockedPuppyModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockFindAllResponse),
        countDocuments: jest
          .fn()
          .mockResolvedValue(Math.ceil(mockFindAllResponse.length / 20)),
      });

      const result = await service.findAll({});

      expect(result).toEqual({
        puppies: mockFindAllResponse,
        lastPage: 1,
      });
    });

    it('should be called with the correct query', async () => {
      const mockFindAllResponse = [];

      mockedPuppyModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockFindAllResponse),
        countDocuments: jest.fn().mockReturnThis(),
      });

      await service.findAll({
        search: 'Buddy',
        breed: 'Golden Retriever',
        age: 2,
        size: 'medium',
        gender: 'male',
      });

      expect(mockedPuppyModel.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: 'Buddy', $options: 'i' } },
          { breed: { $regex: 'Buddy', $options: 'i' } },
        ],
        breed: 'golden retriever',
        age: 2,
        size: 'medium',
        gender: 'male',
      });
    });
  });

  describe('getFilters', () => {
    it('should return the filter options', async () => {
      const mockFilterOptions = {
        breeds: ['Golden Retriever', 'Labrador'],
      };

      mockedPuppyModel.distinct.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockFilterOptions.breeds),
      });

      const result = await service.getFilters();

      expect(result).toEqual(mockFilterOptions);
    });
  });

  describe('findOne', () => {
    it('should return a puppy', async () => {
      const mockFindOneResponse = {
        name: 'Buddy',
        age: 2,
        breed: 'Golden Retriever',
        traits: ['friendly', 'playful'],
        photoUrl: 'https://example.com/buddy.jpg',
      };

      mockedPuppyModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFindOneResponse),
      });

      const result = await service.findOne('1');

      expect(result).toEqual(mockFindOneResponse);
    });
  });

  describe('create', () => {
    it('should create a puppy', async () => {
      const mockCreateResponse = {
        name: 'Buddy',
        age: 2,
        breed: 'Golden Retriever',
        traits: ['friendly', 'playful'],
        photoUrl: 'https://example.com/buddy.jpg',
      };

      mockedPuppyModel.create.mockResolvedValue(mockCreateResponse);

      const result = await service.create({
        name: 'Buddy',
        age: 2,
        gender: 'male',
        isVaccinated: true,
        isNeutered: false,
        breed: 'Golden Retriever',
        size: 'medium',
        traits: ['friendly', 'playful'],
        photoUrl: 'https://example.com/buddy.jpg',
      });

      expect(result).toEqual(mockCreateResponse);
    });
  });

  describe('delete', () => {
    it('should delete a puppy', async () => {
      const mockDeleteResponse = {
        name: 'Buddy',
        age: 2,
        breed: 'Golden Retriever',
        traits: ['friendly', 'playful'],
        photoUrl: 'https://example.com/buddy.jpg',
      };

      mockedPuppyModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDeleteResponse),
      });

      const result = await service.delete('1');

      expect(result).toEqual(mockDeleteResponse);
    });
  });

  describe('update', () => {
    it('should update a puppy', async () => {
      const mockUpdateResponse = {
        name: 'Buddy',
        age: 3,
        breed: 'Golden Retriever',
        traits: ['friendly', 'playful'],
        photoUrl: 'https://example.com/buddy.jpg',
      };

      mockedPuppyModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdateResponse),
      });

      const result = await service.update('1', {
        name: 'Buddy',
        age: 3,
      });

      expect(result).toEqual(mockUpdateResponse);
    });
  });
});
