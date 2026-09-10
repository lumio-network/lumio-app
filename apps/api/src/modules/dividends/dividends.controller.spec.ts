import { Test, TestingModule } from '@nestjs/testing';
import { DividendsController } from './dividends.controller';
import { DividendsService } from './dividends.service';

describe('DividendsController', () => {
  let controller: DividendsController;
  let service: DividendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DividendsController],
      providers: [DividendsService],
    }).compile();

    controller = module.get<DividendsController>(DividendsController);
    service = module.get<DividendsService>(DividendsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /dividends', () => {
    it('should return not-implemented summary', () => {
      const result = controller.summary();

      expect(result).toEqual({
        contract: 'dividends',
        status: 'not-implemented',
      });
    });

    it('should call dividends service summary method', () => {
      const serviceSpy = jest.spyOn(service, 'summary');
      
      controller.summary();
      
      expect(serviceSpy).toHaveBeenCalledTimes(1);
    });
  });
});