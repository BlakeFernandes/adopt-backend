import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Adopters } from 'src/database/adopters.dto';
import { AdoptersService } from './adopters.service';

describe('AdoptersService', () => {
  let service: AdoptersService;
  const mockedPuppyModel = {
    findById: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };
  const mockedAdoptersModel = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdoptersService,
        { provide: getModelToken('Puppy'), useValue: mockedPuppyModel },
        { provide: getModelToken('Adopters'), useValue: mockedAdoptersModel },
      ],
    }).compile();

    service = module.get<AdoptersService>(AdoptersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('adopt', () => {
    it('should add a new adopter', async () => {
      const mockAdoptResponse: Adopters = {
        name: 'John Doe',
        email: 'john@doe.co.nz',
        phone: '1234567890',
        message: 'I want to adopt this puppy',
        puppyId: '1',
      };

      mockedPuppyModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ id: '1' }),
      });
      mockedAdoptersModel.create.mockReturnValue(mockAdoptResponse);

      const result = await service.adopt({
        puppyId: '1',
        name: 'John Doe',
        email: 'john@doe.co.nz',
        phone: '1234567890',
        message: 'I want to adopt this puppy',
      });

      expect(result).toEqual(mockAdoptResponse);
      expect(mockedAdoptersModel.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@doe.co.nz',
        phone: '1234567890',
        message: 'I want to adopt this puppy',
        puppyId: '1',
      });
    });
  });
});
