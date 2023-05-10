import { ServiceContext } from "./serviceContext";
import { withError } from "./withError";
import { Amount } from "@signumjs/util";
import { AxtcContractDataView } from "./axtcContractDataView";
import { GenericContractViewerService } from "./genericContractViewerService";
import { AxtcContractData } from "./axtcContractData";

export class AxtcContractService extends GenericContractViewerService {
  constructor(context: ServiceContext) {
    super(context);
  }

  public contractId(): string {
    return this.context.axtcContractId;
  }

  public async readContractData(): Promise<AxtcContractData> {
    return withError<AxtcContractData>(async () => {
      const { ledger } = this.context;
      const contract = await ledger.contract.getContract(this.contractId());
      const contractDataView = new AxtcContractDataView(contract);
      const [token] = await Promise.all([
        this.getTokenData(contractDataView.getTokenId()),
        ledger.account.getAccountTransactions({ accountId: this.contractId() }),
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
