import { Contract, ContractDataView } from "@signumjs/contracts";
import { toStableCoinAmount } from "@/app/tokenQuantity";

enum PoolContractDataIndex {
  PoolName = 5,
  PoolRate,
  PoolTokenQuantity,
  NominalLiquidity,
  PoolTokenId,
  PaidAXTC,
  GrossMarketValue,
  ApprovalAccount1 = 13,
  ApprovalApprovedDistribution1,
  ApprovalAccount2,
  ApprovalApprovedDistribution2,
  ApprovalAccount3,
  ApprovalApprovedDistribution3,
  ApprovalAccount4,
  ApprovalApprovedDistribution4,
  IsDeactivated,
}

export class PoolContractDataView {
  private readonly view: ContractDataView;
  private readonly id: string;

  constructor(contract: Contract) {
    this.id = contract.at;
    this.view = new ContractDataView(contract);
  }

  private getApprovedAccount(
    approvalIndex: PoolContractDataIndex,
    accountIndex: PoolContractDataIndex
  ) {
    const approved = parseInt(this.view.getVariableAsDecimal(approvalIndex));
    if (approved) {
      return this.view.getVariableAsDecimal(accountIndex);
    }
    return "";
  }

  getId(): string {
    return this.id;
  }

  getPoolTokenName(): string {
    return this.view.getVariableAsDecimal(PoolContractDataIndex.PoolName);
  }

  getIsDeactivated(): boolean {
    return (
      Number(
        this.view.getVariableAsDecimal(PoolContractDataIndex.IsDeactivated)
      ) === 1
    );
  }

  getPoolTokenRate(): number {
    const qnt = this.view.getVariableAsDecimal(PoolContractDataIndex.PoolRate);
    return parseFloat(toStableCoinAmount(qnt));
  }

  getGrossMarketValue(): number {
    const qnt = this.view.getVariableAsDecimal(
      PoolContractDataIndex.GrossMarketValue
    );
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
    const qnt = this.view.getVariableAsDecimal(PoolContractDataIndex.PaidAXTC);
    return parseFloat(toStableCoinAmount(qnt));
  }
}
