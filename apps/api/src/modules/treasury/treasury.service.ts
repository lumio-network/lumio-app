import { Injectable } from "@nestjs/common";
import type { ContractName } from "@lumio/sdk";

/**
 * Treasury endpoints will read pooled balances via `@lumio/sdk`. Scaffold only:
 * returns a placeholder until the SDK is wired to the deployed contract.
 */
@Injectable()
export class TreasuryService {
  summary(): { contract: ContractName; status: "not-implemented" } {
    return { contract: "treasury", status: "not-implemented" };
  }
}
