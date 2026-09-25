import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
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
  await app.listen(port);
  console.log(`Lumio API listening on http://localhost:${port}`);
}

void bootstrap();
