import { Test, TestingModule } from '@nestjs/testing';
import { PuppiesController } from './puppies.controller';
describe('PuppiesController', () => {
  let puppiesController: PuppiesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PuppiesController],
      providers: [PuppiesController],
    }).compile();

    puppiesController = app.get<PuppiesController>(PuppiesController);
  });

  describe('root', () => {
    it('It should return the full list of puppies', () => {
      expect(puppiesController.findAll()).toHaveLength(30);
    });

    it('First puppy should be valid', () => {
      expect(puppiesController.findAll()[0]).toEqual({
        name: 'Samuel',
        age: 1,
        gender: 'male',
        isVaccinated: true,
        isNeutered: true,
        size: 'small',
        breed: 'Jack Russell',
        traits: ['Quiet', 'Great with children'],
        photoUrl: 'https://images.dog.ceo/breeds/brabancon/n02112706_971.jpg',
      });
    });
  });
});
