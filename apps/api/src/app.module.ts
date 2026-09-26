import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { HealthController } from "./health/health.controller";
import { TreasuryModule } from "./modules/treasury/treasury.module";
import { GovernanceModule } from "./modules/governance/governance.module";
import { DividendsModule } from "./modules/dividends/dividends.module";
import { validateEnv } from "./config/env.validation";
import type { AppConfig } from "./config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      // No .env file is required; env vars are supplied by the host environment
      // (docker-compose, CI, or a local shell export).
      ignoreEnvFile: true,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        throttlers: [
          {
            ttl: configService.get<number>("RATE_LIMIT_TTL_MS")!,
            limit: configService.get<number>("RATE_LIMIT_LIMIT")!,
          },
        ],
      }),
    }),
    TreasuryModule,
    GovernanceModule,
    DividendsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
