import { TreasuryController } from './treasury.controller';

describe('TreasuryController', () => {
  let controller: TreasuryController;
  let mockService: any;

  beforeEach(() => {
    mockService = {
      summary: jest.fn(() => ({
        contract: 'treasury',
        status: 'not-implemented',
      })),
    };
    controller = new TreasuryController(mockService);
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
      controller.summary();
      
      expect(mockService.summary).toHaveBeenCalledTimes(1);
    });
  });
});