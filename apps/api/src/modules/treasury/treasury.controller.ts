import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { TreasuryService } from "./treasury.service";

@ApiTags("treasury")
@Controller("treasury")
export class TreasuryController {
  constructor(private readonly treasury: TreasuryService) {}

  @Get()
  @ApiOkResponse({
    description: "Treasury summary",
    schema: {
      type: "object",
      required: ["contract", "status"],
      properties: {
        contract: { type: "string", enum: ["treasury"] },
        status: { type: "string", enum: ["not-implemented"] },
      },
    },
  })
  summary() {
    return this.treasury.summary();
  }
}
