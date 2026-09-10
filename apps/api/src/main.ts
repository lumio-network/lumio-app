import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS for dashboard and admin origins
  const corsOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3001', 'http://localhost:3002'];
    
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`Lumio API listening on http://localhost:${port}`);
}

void bootstrap();
