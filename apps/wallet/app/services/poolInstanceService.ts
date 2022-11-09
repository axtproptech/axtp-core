import { ServiceContext } from "./serviceContext";
import { withError } from "./withError";
import { Amount } from "@signumjs/util";
import { PoolContractDataView } from "./poolContractDataView";
import { GenericContractService } from "./genericContractService";
import { PoolContractData } from "@/types/poolContractData";

export class PoolInstanceService extends GenericContractService {
  constructor(context: ServiceContext, private poolId: string) {
    super(context);
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

      const supply = contractDataView.getPoolTokenMaxQuantity().toString(10);
      return {
        poolId: this.poolId,
        balance: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        token: {
          ...token,
          supply,
        },
        transactions: transactions.transactions,
        paidDistribution: contractDataView.getDistributedStableCoins(),
        maxShareQuantity: contractDataView.getPoolTokenMaxQuantity(),
        nominalLiquidity: contractDataView.getNominalLiquidity(),
        tokenRate: contractDataView.getPoolTokenRate(),
      };
    });
  }
}
