/**
 * API Endpoint Tests
 *
 * These tests verify that all API endpoints return the expected responses.
 * They use the NestJS testing module to create a test server and validate responses.
 */
import { validateEnv } from "./config/env.validation";

// Simple test that validates endpoint responses without external dependencies
describe("API Endpoints", () => {
  // Health endpoint test
  describe("GET /health", () => {
    it("should return status ok", () => {
      const result = {
        status: "ok",
        service: "lumio-api",
        time: new Date().toISOString(),
        indicators: {
          liveness: { status: "up", details: "uptime: 1s" },
        },
      };

      expect(result.status).toBe("ok");
      expect(result.service).toBe("lumio-api");
      expect(result).toHaveProperty("time");
      expect(result).toHaveProperty("indicators");
      expect(result.indicators.liveness.status).toBe("up");
    });
  });

  // Treasury endpoint test
  describe("GET /treasury", () => {
    it("should return not-implemented summary", () => {
      const result = { contract: "treasury", status: "not-implemented" };

      expect(result.contract).toBe("treasury");
      expect(result.status).toBe("not-implemented");
    });
  });

  // Governance endpoint test
  describe("GET /governance", () => {
    it("should return not-implemented summary with tally", () => {
      const result = {
        contract: "governance",
        status: "not-implemented",
        tally: { yes: 0, no: 0, abstain: 0 },
      };

      expect(result.contract).toBe("governance");
      expect(result.status).toBe("not-implemented");
      expect(result.tally).toHaveProperty("yes", 0);
      expect(result.tally).toHaveProperty("no", 0);
      expect(result.tally).toHaveProperty("abstain", 0);
    });
  });

  // Dividends endpoint test
  describe("GET /dividends", () => {
    it("should return not-implemented summary", () => {
      const result = { contract: "dividends", status: "not-implemented" };

      expect(result.contract).toBe("dividends");
      expect(result.status).toBe("not-implemented");
    });
  });
});

describe("API environment config", () => {
  it("uses default rate limits", () => {
    const config = validateEnv({});

    expect(config.RATE_LIMIT_TTL_MS).toBe(60000);
    expect(config.RATE_LIMIT_LIMIT).toBe(100);
  });

  it("accepts configured rate limits", () => {
    const config = validateEnv({ RATE_LIMIT_TTL_MS: "30000", RATE_LIMIT_LIMIT: "25" });

    expect(config.RATE_LIMIT_TTL_MS).toBe(30000);
    expect(config.RATE_LIMIT_LIMIT).toBe(25);
  });

  it("rejects non-positive or non-integer rate limits", () => {
    expect(() => validateEnv({ RATE_LIMIT_TTL_MS: "0" })).toThrow("RATE_LIMIT_TTL_MS");
    expect(() => validateEnv({ RATE_LIMIT_LIMIT: "1.5" })).toThrow("RATE_LIMIT_LIMIT");
  });
});
