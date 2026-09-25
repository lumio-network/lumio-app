import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { GovernanceService } from "./governance.service";

@ApiTags("governance")
@Controller("governance")
export class GovernanceController {
  constructor(private readonly governance: GovernanceService) {}

  @ApiOkResponse({ description: "Returns the current governance contract summary and tally." })
  @Get()
  summary() {
    return this.governance.summary();
  }
}
