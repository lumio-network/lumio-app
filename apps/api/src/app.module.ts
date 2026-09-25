import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health/health.controller";
import { TreasuryModule } from "./modules/treasury/treasury.module";
import { GovernanceModule } from "./modules/governance/governance.module";
import { DividendsModule } from "./modules/dividends/dividends.module";
import { validateEnv } from "./config/env.validation";

@Module({
  imports: [
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
})
export class AppModule {}
