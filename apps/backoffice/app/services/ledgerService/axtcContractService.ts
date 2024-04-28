import { ServiceContext } from "./serviceContext";
import { Config } from "@/app/config";
import { Amount } from "@signumjs/util";
import { InputValidationService } from "@/app/services/inputValidationService";
import { MasterContractData } from "@/types/masterContractData";
import { GenericContractService } from "./genericContractService";
import { withError } from "@axtp/core";
import { AxtcContractDataView } from "@axtp/core/smartContractViewer";

// TODO: refactor to use shared core package
export class AxtcContractService extends GenericContractService {
  constructor(context: ServiceContext) {
    super(context);
  }

  public activationCosts(): Amount {
    return Amount.fromSigna(Config.MasterContract.ActivationCosts);
  }

  public interactionFee(): Amount {
    return Amount.fromSigna(Config.MasterContract.InteractionFee);
  }

  public contractId(): string {
    return Config.MasterContract.Id;
  }

  public async readContractData(): Promise<MasterContractData> {
    return withError<MasterContractData>(async () => {
      const { ledger } = this.context;
      const contract = await ledger.contract.getContract(this.contractId());
      const contractDataView = new AxtcContractDataView(contract);
      const [token, transactions] = await Promise.all([
        this.getTokenData(contractDataView.getTokenId()),
        ledger.account.getAccountTransactions({ accountId: this.contractId() }),
      ]);

      return {
        id: this.contractId(),
        balance: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        token,
        transactions: transactions.transactions,
        currentSendPoolAddress: contractDataView.getCurrentPoolAddress(),
        approvalStatusBurning: contractDataView.getBurningApprovalStatus(),
        approvalStatusMinting: contractDataView.getMintingApprovalStatus(),
        approvalStatusSendToPool:
          contractDataView.getSendingToPoolApprovalStatus(),
      };
    });
  }

  public async requestMint(quantity: number) {
    InputValidationService.assertNumberGreaterOrEqualThan(0.1, quantity);
    return this.callMethod(Config.MasterContract.Methods.RequestMint, quantity);
  }

  public async approveMint() {
    return this.callMethod(Config.MasterContract.Methods.ApproveMint);
  }

  public async requestBurn(quantity: number) {
    InputValidationService.assertNumberGreaterOrEqualThan(0.1, quantity);
    return this.callMethod(Config.MasterContract.Methods.RequestBurn, quantity);
  }

  public async approveBurn() {
    return this.callMethod(Config.MasterContract.Methods.ApproveBurn);
  }

  public async requestSendToPool(quantity: number, poolId: string) {
    return this.callMethod(
      Config.MasterContract.Methods.RequestSendToPool,
      quantity,
      poolId
    );
  }

  public async approveSendToPool() {
    return this.callMethod(Config.MasterContract.Methods.ApproveSendToPool);
  }
}
