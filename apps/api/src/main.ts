import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import type { AppConfig } from "./config/env.validation";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule);

  // -----------------------------------------------------------------
  // Global exception filter – every unhandled error gets a consistent
  // JSON envelope: { statusCode, message, error, timestamp, path }
  // -----------------------------------------------------------------
  app.useGlobalFilters(new AllExceptionsFilter());

  // -----------------------------------------------------------------
  // Read config via ConfigService (issue #20)
  // process.env is no longer accessed directly after this point.
  // -----------------------------------------------------------------
  const configService = app.get(ConfigService<AppConfig>);

  const corsOrigins = configService
    .get<string>("CORS_ORIGINS")!
    .split(",")
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = configService.get<number>("PORT")!;
  await app.listen(port);

  // -----------------------------------------------------------------
  // Issue #22 – use Nest Logger instead of console.log
  // -----------------------------------------------------------------
  logger.log(`Lumio API listening on http://localhost:${port}`);
}

void bootstrap();
