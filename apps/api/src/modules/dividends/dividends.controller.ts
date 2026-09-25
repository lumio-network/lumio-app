import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DividendsService } from "./dividends.service";

@ApiTags("dividends")
@Controller("dividends")
export class DividendsController {
  constructor(private readonly dividends: DividendsService) {}

  @ApiOkResponse({ description: "Returns the current dividends contract summary." })
  @Get()
  summary() {
    return this.dividends.summary();
  }
}
