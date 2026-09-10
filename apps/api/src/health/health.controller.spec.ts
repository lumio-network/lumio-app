import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /health', () => {
    it('should return status "ok" with documented fields', () => {
      const result = controller.check();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('service', 'lumio-api');
      expect(result).toHaveProperty('time');
      expect(result).toHaveProperty('indicators');
      expect(typeof result.time).toBe('string');
      expect(result.indicators).toHaveProperty('liveness');
      expect(result.indicators.liveness).toHaveProperty('status', 'up');
    });

    it('should return a valid ISO timestamp', () => {
      const result = controller.check();
      
      expect(() => new Date(result.time)).not.toThrow();
      expect(new Date(result.time).toISOString()).toBe(result.time);
    });

    it('should include liveness indicator with uptime details', () => {
      const result = controller.check();
      
      expect(result.indicators.liveness).toHaveProperty('status', 'up');
      expect(result.indicators.liveness).toHaveProperty('details');
      expect(typeof result.indicators.liveness.details).toBe('string');
      expect(result.indicators.liveness.details).toMatch(/uptime: \d+(\.\d+)?s/);
    });
  });
});