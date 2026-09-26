import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { GovernanceService } from "./governance.service";

@ApiTags("governance")
@Controller("governance")
export class GovernanceController {
  constructor(private readonly governance: GovernanceService) {}

  @Get()
  @ApiOkResponse({
    description: "Governance summary and proposal tally",
    schema: {
      type: "object",
      required: ["contract", "status", "tally"],
      properties: {
        contract: { type: "string", enum: ["governance"] },
        status: { type: "string", enum: ["not-implemented"] },
        tally: {
          type: "object",
          required: ["yes", "no", "abstain"],
          properties: {
            yes: { type: "integer", example: 0 },
            no: { type: "integer", example: 0 },
            abstain: { type: "integer", example: 0 },
          },
        },
      },
    },
  })
  summary() {
    return this.governance.summary();
  }
}
