import { Test, TestingModule } from '@nestjs/testing';
import { Adopters } from 'src/database/adopters.dto';
import { AdoptDto, AdoptersController } from './adopters.controller';
import { AdoptersService } from './adopters.service';

describe('AdoptersController', () => {
  let controller: AdoptersController;

  const mockAdoptersService = {
    adopt: jest.fn<Promise<Adopters>, AdoptDto[]>().mockImplementation((dto) =>
      Promise.resolve({
        id: '1',
        ...dto,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdoptersController],
      providers: [
        {
          provide: AdoptersService,
          useValue: mockAdoptersService,
        },
      ],
    }).compile();

    controller = module.get<AdoptersController>(AdoptersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('adopt', () => {
    it('POST /adopt', async () => {
      const newAdopterDTO: AdoptDto = {
        name: 'John Doe',
        email: 'john@doe.co.nz',
        phone: '1234567890',
        message: 'I want to adopt this puppy',
        puppyId: '1',
      };

      await expect(controller.adopt(newAdopterDTO)).resolves.toEqual({
        id: '1',
        ...newAdopterDTO,
      });
    });
  });
});
