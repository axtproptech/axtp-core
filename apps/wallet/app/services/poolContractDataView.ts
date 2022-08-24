import { Contract, ContractDataView } from "@signumjs/contracts";
import { toStableCoinAmount } from "@/app/tokenQuantity";

enum PoolContractDataIndex {
  PoolName = 4,
  PoolRate,
  PoolTokenQuantity,
  NominalLiquidity,
  PoolTokenId,
  PendingDistributionAXT,
  PaidAXT,
}

export class PoolContractDataView {
  private readonly view: ContractDataView;
  private readonly id: string;

  constructor(contract: Contract) {
    this.id = contract.at;
    this.view = new ContractDataView(contract);
  }

  getId(): string {
    return this.id;
  }

  getPoolTokenName(): string {
    return this.view.getVariableAsDecimal(PoolContractDataIndex.PoolName);
  }

  getPoolTokenRate(): number {
    const qnt = this.view.getVariableAsDecimal(PoolContractDataIndex.PoolRate);
    return parseFloat(toStableCoinAmount(qnt));
  }

  getPoolTokenMaxQuantity(): number {
    return parseInt(
      this.view.getVariableAsDecimal(PoolContractDataIndex.PoolTokenQuantity),
      10
    );
  }

  getPoolTokenId(): string {
    return this.view.getVariableAsDecimal(PoolContractDataIndex.PoolTokenId);
  }

  getNominalLiquidity(): number {
    const qnt = this.view.getVariableAsDecimal(
      PoolContractDataIndex.NominalLiquidity
    );
    return parseFloat(toStableCoinAmount(qnt));
  }

  getDistributedStableCoins(): number {
    const qnt = this.view.getVariableAsDecimal(PoolContractDataIndex.PaidAXT);
    return parseFloat(toStableCoinAmount(qnt));
  }

  getAccumulatedStableCoinsForDistribution(): number {
    const qnt = this.view.getVariableAsDecimal(
      PoolContractDataIndex.PendingDistributionAXT
    );
    return parseFloat(toStableCoinAmount(qnt));
  }
}
