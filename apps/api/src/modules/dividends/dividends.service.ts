import { Injectable } from "@nestjs/common";
import type { ContractName } from "@lumio/sdk";

/**
 * Dividend endpoints will read payout shares via `@lumio/sdk`. Scaffold only:
 * returns a placeholder until the SDK is wired.
 */
@Injectable()
export class DividendsService {
  summary(): { contract: ContractName; status: "not-implemented" } {
    return { contract: "dividends", status: "not-implemented" };
  }
}
