import { Injectable } from "@nestjs/common";
import type { ContractName, Tally } from "@lumio/sdk";

/**
 * Governance endpoints will read proposals and tallies via `@lumio/sdk`.
 * Scaffold only: returns a placeholder until the SDK is wired.
 */
@Injectable()
export class GovernanceService {
  summary(): { contract: ContractName; status: "not-implemented"; tally: Tally } {
    return {
      contract: "governance",
      status: "not-implemented",
      tally: { yes: 0, no: 0, abstain: 0 },
    };
  }
}
