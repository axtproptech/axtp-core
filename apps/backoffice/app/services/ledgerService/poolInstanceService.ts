import { ServiceContext } from "./serviceContext";
import { Config } from "@/app/config";
import { withError } from "./withError";
import { Amount } from "@signumjs/util";
import { InputValidationService } from "../inputValidationService";
import { PoolContractDataView } from "./poolContractDataView";
import { GenericContractService } from "./genericContractService";
import { PoolContractData } from "@/types/poolContractData";

export class PoolInstanceService extends GenericContractService {
  constructor(context: ServiceContext, private poolId: string) {
    super(context);
  }

  public activationCosts(): Amount {
    return Amount.fromSigna(Config.PoolContract.ActivationCosts);
  }

  public interactionFee(): Amount {
    return Amount.fromSigna(Config.PoolContract.InteractionFee);
  }

  contractId(): string {
    return this.poolId;
  }

  public readContractData() {
    return withError<PoolContractData>(async () => {
      const { ledger } = this.context;
      const contract = await ledger.contract.getContract(this.poolId);
      const contractDataView = new PoolContractDataView(contract);
      const [token, transactions] = await Promise.all([
        this.getTokenData(contractDataView.getPoolTokenId()),
        ledger.account.getAccountTransactions({ accountId: this.contractId() }),
      ]);
      return {
        balance: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        token,
        transactions: transactions.transactions,
        approvalStatusDistribution:
          contractDataView.getDistributionApprovalStatus(),
        paidDistribution: contractDataView.getDistributedStableCoins(),
        maxShareQuantity: contractDataView.getPoolTokenMaxQuantity(),
        nominalLiquidity: contractDataView.getNominalLiquidity(),
        tokenRate: contractDataView.getPoolTokenRate(),
      };
    });
  }

  public async approveDistribution() {
    return this.callMethod(Config.PoolContract.Methods.ApproveDistribution);
  }

  public async sendShareToHolder(recipientId: string, quantity: number) {
    InputValidationService.assertNumberGreaterOrEqualThan(1, quantity);
    return this.callMethod(
      Config.PoolContract.Methods.SendShareToHolder,
      recipientId,
      quantity
    );
  }
}
