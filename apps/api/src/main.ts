import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import type { AppConfig } from "./config/env.validation";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  // -----------------------------------------------------------------
  // Global exception filter – every unhandled error gets a consistent
  // JSON envelope: { statusCode, message, error, timestamp, path }
  // -----------------------------------------------------------------
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // -----------------------------------------------------------------
  // Read config via ConfigService (issue #20)
  // process.env is no longer accessed directly after this point.
  // -----------------------------------------------------------------
  const configService = app.get<ConfigService<AppConfig>>(ConfigService);

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
