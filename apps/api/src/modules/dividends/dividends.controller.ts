import { Controller, Get } from "@nestjs/common";
import { DividendsService } from "./dividends.service";

@Controller("dividends")
export class DividendsController {
  constructor(private readonly dividends: DividendsService) {}

  @Get()
  summary() {
    return this.dividends.summary();
  }
}
