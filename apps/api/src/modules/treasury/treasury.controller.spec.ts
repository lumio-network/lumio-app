import { Test, TestingModule } from '@nestjs/testing';
import { TreasuryController } from './treasury.controller';
import { TreasuryService } from './treasury.service';

describe('TreasuryController', () => {
  let controller: TreasuryController;
  let service: TreasuryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreasuryController],
      providers: [TreasuryService],
    }).compile();

    controller = module.get<TreasuryController>(TreasuryController);
    service = module.get<TreasuryService>(TreasuryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /treasury', () => {
    it('should return not-implemented summary', () => {
      const result = controller.summary();

      expect(result).toEqual({
        contract: 'treasury',
        status: 'not-implemented',
      });
    });

    it('should call treasury service summary method', () => {
      const serviceSpy = jest.spyOn(service, 'summary');
      
      controller.summary();
      
      expect(serviceSpy).toHaveBeenCalledTimes(1);
    });
  });
});