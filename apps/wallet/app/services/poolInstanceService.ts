import { ServiceContext } from "./serviceContext";
import { Amount, ChainTime } from "@signumjs/util";
import { PoolContractDataView } from "./poolContractDataView";
import { GenericContractService } from "./genericContractService";
import { PoolContractData } from "@/types/poolContractData";
import {
  DefaultAliasData,
  PoolAliasData,
  PoolPricing,
} from "@/types/poolAliasData";
import { Descriptor, DescriptorData } from "@signumjs/standards";
import { withError } from "@axtp/core/common/withError";

export class PoolInstanceService extends GenericContractService {
  constructor(context: ServiceContext, private poolId: string) {
    super(context);
  }

  contractId(): string {
    return this.poolId;
  }

  public getPoolAliasData(descriptor: Descriptor): PoolAliasData {
    const pricing = (
      (descriptor["x-ps"] || []) as { n: number; v: number }[]
    ).map((p) => {
      return {
        valueAXTC: p.v,
        tokenAmount: p.n,
      } as PoolPricing;
    });

    return {
      description: descriptor.description || "",
      whitepaperUrl: (descriptor["x-wp"] || "") as string,
      maximumTokensPerCustomer: (descriptor["x-mxt"] || 4) as number,
      pricing,
    };
  }

  public readContractData() {
    return withError<PoolContractData>(async () => {
      const { ledger } = this.context;
      const [contract, tx] = await Promise.all([
        ledger.contract.getContract(this.poolId),
        ledger.transaction.getTransaction(this.poolId),
      ]);
      const contractDataView = new PoolContractDataView(contract);

      let goalQuantity = 0;
      try {
        const data = DescriptorData.parse(contract.description);
        goalQuantity = Number(data.getCustomField("x-goal") || "0");
      } catch (e) {
        // ignore
      }

      const [token, aliasDescriptor] = await Promise.all([
        this.getTokenData(contractDataView.getPoolTokenId()),
        this.getSRC44AliasDataFromContract(contract),
      ]);

      return {
        created: ChainTime.fromChainTimestamp(tx.timestamp)
          .getDate()
          .toISOString(),
        poolId: this.poolId,
        balance: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        token,
        paidDistribution: contractDataView.getDistributedStableCoins(),
        grossMarketValue: contractDataView.getGrossMarketValue(),
        maxShareQuantity: contractDataView.getPoolTokenMaxQuantity(),
        nominalLiquidity: contractDataView.getNominalLiquidity(),
        tokenRate: contractDataView.getPoolTokenRate(),
        aliasData: this.getPoolAliasData(aliasDescriptor),
        goalQuantity,
      };
    });
  }
}
