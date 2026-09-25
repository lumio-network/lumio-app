import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { HealthController } from "./health/health.controller";
import { TreasuryModule } from "./modules/treasury/treasury.module";
import { GovernanceModule } from "./modules/governance/governance.module";
import { DividendsModule } from "./modules/dividends/dividends.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3000),
        CORS_ORIGINS: Joi.string()
          .default("http://localhost:3001,http://localhost:3002")
          .pattern(/^[^,\s]+(?:\s*,\s*[^,\s]+)*$/)
          .messages({
            "string.pattern.base": "CORS_ORIGINS must be a comma-separated list of origins",
          }),
        DATABASE_URL: Joi.string()
          .uri({ scheme: ["postgres", "postgresql"] })
          .optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    TreasuryModule,
    GovernanceModule,
    DividendsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
