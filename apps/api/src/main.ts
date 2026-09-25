import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import type { AppConfig } from "./config/env.validation";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  // -----------------------------------------------------------------
  // Security headers (issue #24)
  // helmet sets sensible defaults: HSTS, X-Content-Type-Options, etc.
  // It must be registered before CORS so the headers don't conflict.
  // Note: Content-Security-Policy tuning for the dashboard/admin SPA
  // is tracked as a follow-up; default CSP is left in place for now.
  // -----------------------------------------------------------------
  app.use(helmet());
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

  // Configure CORS for dashboard and admin origins
  const corsOrigins = process.env["CORS_ORIGINS"]
    ? process.env["CORS_ORIGINS"].split(",").map((origin) => origin.trim())
    : ["http://localhost:3001", "http://localhost:3002"];
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

  // -----------------------------------------------------------------
  // OpenAPI / Swagger (issue #23)
  // Docs UI:   GET /docs
  // Docs JSON: GET /docs-json
  //
  // Set SWAGGER_DISABLE=true to suppress the docs route in production.
  // -----------------------------------------------------------------
  if (process.env["SWAGGER_DISABLE"] !== "true") {
    const config = new DocumentBuilder()
      .setTitle("Lumio API")
      .setDescription(
        "REST API for the Lumio protocol — treasury, governance, and dividend contracts.",
      )
      .setVersion("0.1.0")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document, {
      jsonDocumentUrl: "docs-json",
    });
  }

  const port = Number(process.env["PORT"] ?? 3000);
  const port = configService.get<number>("PORT")!;
  await app.listen(port);

  // -----------------------------------------------------------------
  // Issue #22 – use Nest Logger instead of console.log
  // -----------------------------------------------------------------
  logger.log(`Lumio API listening on http://localhost:${port}`);
}

void bootstrap();
