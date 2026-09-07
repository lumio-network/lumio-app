import { Controller, Get } from "@nestjs/common";
import { TreasuryService } from "./treasury.service";

@Controller("treasury")
export class TreasuryController {
  constructor(private readonly treasury: TreasuryService) {}

  @Get()
  summary() {
    return this.treasury.summary();
  }
}
