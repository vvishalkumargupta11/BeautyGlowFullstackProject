import { Test, TestingModule } from '@nestjs/testing';
import { SalonServicesController } from './salon-services.controller.js';

describe('SalonServicesController', () => {
  let controller: SalonServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalonServicesController],
    }).compile();

    controller = module.get<SalonServicesController>(SalonServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
