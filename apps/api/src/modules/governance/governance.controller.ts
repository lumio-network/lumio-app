import { Controller, Get } from "@nestjs/common";
import { GovernanceService } from "./governance.service";

@Controller("governance")
export class GovernanceController {
  constructor(private readonly governance: GovernanceService) {}

  @Get()
  summary() {
    return this.governance.summary();
  }
}
