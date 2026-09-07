import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { TreasuryModule } from "./modules/treasury/treasury.module";
import { GovernanceModule } from "./modules/governance/governance.module";
import { DividendsModule } from "./modules/dividends/dividends.module";

@Module({
  imports: [TreasuryModule, GovernanceModule, DividendsModule],
  controllers: [HealthController],
})
export class AppModule {}
