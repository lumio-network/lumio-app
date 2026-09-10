import { DividendsController } from './dividends.controller';

describe('DividendsController', () => {
  let controller: DividendsController;
  let mockService: any;

  beforeEach(() => {
    mockService = {
      summary: jest.fn(() => ({
        contract: 'dividends',
        status: 'not-implemented',
      })),
    };
    controller = new DividendsController(mockService);
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
      controller.summary();
      
      expect(mockService.summary).toHaveBeenCalledTimes(1);
    });
  });
});