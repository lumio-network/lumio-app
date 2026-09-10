import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceController } from './governance.controller';
import { GovernanceService } from './governance.service';

describe('GovernanceController', () => {
  let controller: GovernanceController;
  let service: GovernanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GovernanceController],
      providers: [GovernanceService],
    }).compile();

    controller = module.get<GovernanceController>(GovernanceController);
    service = module.get<GovernanceService>(GovernanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /governance', () => {
    it('should return not-implemented summary with tally', () => {
      const result = controller.summary();

      expect(result).toEqual({
        contract: 'governance',
        status: 'not-implemented',
        tally: { yes: 0, no: 0, abstain: 0 },
      });
    });

    it('should call governance service summary method', () => {
      const serviceSpy = jest.spyOn(service, 'summary');
      
      controller.summary();
      
      expect(serviceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return tally with correct structure', () => {
      const result = controller.summary();

      expect(result.tally).toHaveProperty('yes', 0);
      expect(result.tally).toHaveProperty('no', 0);
      expect(result.tally).toHaveProperty('abstain', 0);
    });
  });
});