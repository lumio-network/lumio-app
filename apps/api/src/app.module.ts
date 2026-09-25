import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health/health.controller";
import { TreasuryModule } from "./modules/treasury/treasury.module";
import { GovernanceModule } from "./modules/governance/governance.module";
import { DividendsModule } from "./modules/dividends/dividends.module";
import { validateEnv } from "./config/env.validation";

/**
 * Rate-limiting defaults (env-configurable).
 *
 * THROTTLE_TTL   – sliding window in seconds   (default: 60)
 * THROTTLE_LIMIT – max requests per TTL window (default: 100)
 *
 * The health endpoint is exempt via @SkipThrottle() on its controller so
 * liveness/readiness probes are never blocked.
 */
const throttleTtl = Number(process.env["THROTTLE_TTL"] ?? 60);
const throttleLimit = Number(process.env["THROTTLE_LIMIT"] ?? 100);

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: "default",
        ttl: throttleTtl,
        limit: throttleLimit,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      // No .env file is required; env vars are supplied by the host environment
      // (docker-compose, CI, or a local shell export).
      ignoreEnvFile: true,
    }),
    TreasuryModule,
    GovernanceModule,
    DividendsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
