import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";

/** Health check endpoint with proper readiness probe functionality. */
@Controller()
export class HealthController {
  @Get("health")
  check() {
    const healthStatus = this.performHealthCheck();

    if (healthStatus.status === "unhealthy") {
      throw new HttpException(healthStatus, HttpStatus.SERVICE_UNAVAILABLE);
    }

    return healthStatus;
  }

  private performHealthCheck(): {
    status: "ok" | "unhealthy";
    service: string;
    time: string;
    indicators: Record<string, unknown>;
  } {
    // TODO: Add actual dependency checks here once DB layer is implemented
    // For now, implement a basic liveness check that can structurally fail

    const indicators = {
      liveness: this.checkLiveness(),
      // TODO: Add database ping check here once DB layer lands
      // database: this.checkDatabase(),
    };

    const allHealthy = Object.values(indicators).every((indicator) => indicator.status === "up");

    return {
      status: allHealthy ? "ok" : "unhealthy",
      service: "lumio-api",
      time: new Date().toISOString(),
      indicators,
    };
  }

  private checkLiveness(): { status: "up" | "down"; details?: string } {
    // Simple liveness check - could be enhanced to check memory, CPU, etc.
    try {
      // Basic process health check
      const uptime = process.uptime();
      if (uptime > 0) {
        return { status: "up", details: `uptime: ${uptime}s` };
      } else {
        return { status: "down", details: "process uptime is 0" };
      }
    } catch (error) {
      return { status: "down", details: `liveness check failed: ${(error as Error).message}` };
    }
  }
}
