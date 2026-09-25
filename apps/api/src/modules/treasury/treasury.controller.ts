import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { TreasuryService } from "./treasury.service";

@ApiTags("treasury")
@Controller("treasury")
export class TreasuryController {
  constructor(private readonly treasury: TreasuryService) {}

  @ApiOkResponse({ description: "Returns the current treasury contract summary." })
  @Get()
  summary() {
    return this.treasury.summary();
  }
}
