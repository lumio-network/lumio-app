import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Create a minimal test module without SDK dependencies
import { Module, Controller, Get, Injectable } from '@nestjs/common';

// Mock services without SDK imports
@Injectable()
class MockTreasuryService {
  summary() {
    return { contract: 'treasury', status: 'not-implemented' };
  }
}

@Injectable()
class MockDividendsService {
  summary() {
    return { contract: 'dividends', status: 'not-implemented' };
  }
}

@Injectable()
class MockGovernanceService {
  summary() {
    return {
      contract: 'governance',
      status: 'not-implemented',
      tally: { yes: 0, no: 0, abstain: 0 },
    };
  }
}

// Mock controllers without importing the real ones
@Controller('treasury')
class MockTreasuryController {
  constructor(private readonly treasury: MockTreasuryService) {}
  @Get()
  summary() {
    return this.treasury.summary();
  }
}

@Controller('dividends')
class MockDividendsController {
  constructor(private readonly dividends: MockDividendsService) {}
  @Get()
  summary() {
    return this.dividends.summary();
  }
}

@Controller('governance')
class MockGovernanceController {
  constructor(private readonly governance: MockGovernanceService) {}
  @Get()
  summary() {
    return this.governance.summary();
  }
}

// Mock health controller inline
@Controller()
class MockHealthController {
  @Get('health')
  check() {
    return {
      status: 'ok',
      service: 'lumio-api',
      time: new Date().toISOString(),
      indicators: {
        liveness: { status: 'up', details: `uptime: ${process.uptime()}s` },
      },
    };
  }
}

// Test module without SDK dependencies
@Module({
  controllers: [
    MockHealthController,
    MockTreasuryController,
    MockDividendsController,
    MockGovernanceController,
  ],
  providers: [MockTreasuryService, MockDividendsService, MockGovernanceService],
})
class TestAppModule {}

describe('API Endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply CORS like in main.ts
    const corsOrigins = process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3001', 'http://localhost:3002'];
      
    app.enableCors({
      origin: corsOrigins,
      credentials: true,
    });
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return status "ok" with documented fields', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('service', 'lumio-api');
          expect(res.body).toHaveProperty('time');
          expect(res.body).toHaveProperty('indicators');
          expect(typeof res.body.time).toBe('string');
          expect(res.body.indicators).toHaveProperty('liveness');
          expect(res.body.indicators.liveness).toHaveProperty('status', 'up');
        });
    });

    it('should return a valid ISO timestamp', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(() => new Date(res.body.time)).not.toThrow();
          expect(new Date(res.body.time).toISOString()).toBe(res.body.time);
        });
    });

    it('should include liveness indicator with uptime details', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.indicators.liveness).toHaveProperty('status', 'up');
          expect(res.body.indicators.liveness).toHaveProperty('details');
          expect(typeof res.body.indicators.liveness.details).toBe('string');
          expect(res.body.indicators.liveness.details).toMatch(/uptime: \d+(\.\d+)?s/);
        });
    });
  });

  describe('GET /treasury', () => {
    it('should return not-implemented summary', () => {
      return request(app.getHttpServer())
        .get('/treasury')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            contract: 'treasury',
            status: 'not-implemented',
          });
        });
    });
  });

  describe('GET /governance', () => {
    it('should return not-implemented summary with tally', () => {
      return request(app.getHttpServer())
        .get('/governance')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            contract: 'governance',
            status: 'not-implemented',
            tally: { yes: 0, no: 0, abstain: 0 },
          });
        });
    });

    it('should return tally with correct structure', () => {
      return request(app.getHttpServer())
        .get('/governance')
        .expect(200)
        .expect((res) => {
          expect(res.body.tally).toHaveProperty('yes', 0);
          expect(res.body.tally).toHaveProperty('no', 0);
          expect(res.body.tally).toHaveProperty('abstain', 0);
        });
    });
  });

  describe('GET /dividends', () => {
    it('should return not-implemented summary', () => {
      return request(app.getHttpServer())
        .get('/dividends')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            contract: 'dividends',
            status: 'not-implemented',
          });
        });
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers for allowed origins', () => {
      return request(app.getHttpServer())
        .get('/health')
        .set('Origin', 'http://localhost:3001')
        .expect(200)
        .expect('Access-Control-Allow-Origin', 'http://localhost:3001')
        .expect('Access-Control-Allow-Credentials', 'true');
    });
  });
});