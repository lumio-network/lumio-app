import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DividendsService } from "./dividends.service";

@ApiTags("dividends")
@Controller("dividends")
export class DividendsController {
  constructor(private readonly dividends: DividendsService) {}

  @Get()
  @ApiOkResponse({
    description: "Dividend summary",
    schema: {
      type: "object",
      required: ["contract", "status"],
      properties: {
        contract: { type: "string", enum: ["dividends"] },
        status: { type: "string", enum: ["not-implemented"] },
      },
    },
  })
  summary() {
    return this.dividends.summary();
  }
}
