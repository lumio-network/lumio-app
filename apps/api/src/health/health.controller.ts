import { Controller, Get } from "@nestjs/common";

/** Liveness probe. The one endpoint that does real work in the scaffold. */
@Controller()
export class HealthController {
  @Get("health")
  check() {
    return { status: "ok", service: "lumio-api", time: new Date().toISOString() };
  }
}
