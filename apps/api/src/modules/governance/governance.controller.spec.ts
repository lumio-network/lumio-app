import { GovernanceController } from './governance.controller';

describe('GovernanceController', () => {
  let controller: GovernanceController;
  let mockService: any;

  beforeEach(() => {
    mockService = {
      summary: jest.fn(() => ({
        contract: 'governance',
        status: 'not-implemented',
        tally: { yes: 0, no: 0, abstain: 0 },
      })),
    };
    controller = new GovernanceController(mockService);
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
      controller.summary();
      
      expect(mockService.summary).toHaveBeenCalledTimes(1);
    });

    it('should return tally with correct structure', () => {
      const result = controller.summary();

      expect(result.tally).toHaveProperty('yes', 0);
      expect(result.tally).toHaveProperty('no', 0);
      expect(result.tally).toHaveProperty('abstain', 0);
    });
  });
});