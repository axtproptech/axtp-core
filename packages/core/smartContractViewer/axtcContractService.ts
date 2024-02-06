import { withError } from "../common/withError";
import { Amount } from "@signumjs/util";
import { AxtcContractDataView } from "./axtcContractDataView";
import { BaseContractViewerService } from "./baseContractViewerService";
import { AxtcContractData } from "./axtcContractData";
import { Ledger } from "@signumjs/core";

export class AxtcContractService extends BaseContractViewerService {
  constructor(ledger: Ledger, private axtcContractId: string) {
    super(ledger);
  }

  public contractId(): string {
    return this.axtcContractId;
  }

  public async readContractData(): Promise<AxtcContractData> {
    return withError<AxtcContractData>(async () => {
      const contract = await this.ledger.contract.getContract(
        this.contractId()
      );
      const contractDataView = new AxtcContractDataView(contract);
      const [token] = await Promise.all([
        this.getTokenData(contractDataView.getTokenId()),
        this.ledger.account.getAccountTransactions({
          accountId: this.contractId(),
        }),
      ]);

      return {
        id: this.contractId(),
        balance: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        token,
        currentSendPoolAddress: contractDataView.getCurrentPoolAddress(),
        approvalStatusBurning: contractDataView.getBurningApprovalStatus(),
        approvalStatusMinting: contractDataView.getMintingApprovalStatus(),
        approvalStatusSendToPool:
          contractDataView.getSendingToPoolApprovalStatus(),
      };
    });
  }
}
