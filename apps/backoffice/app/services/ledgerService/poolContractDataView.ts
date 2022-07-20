import { Contract, ContractDataView } from "@signumjs/contracts";
import { toStableCoinAmount } from "@/app/tokenQuantity";
import { ApprovalStatus } from "@/types/approvalStatus";

enum PoolContractDataIndex {
  PoolName = 4,
  PoolRate,
  PoolTokenQuantity,
  NominalLiquidity,
  PoolTokenId,
  PendingDistributionRESTC,
  PaidRESTC,
  ApprovalAccount1 = 12,
  ApprovalApprovedDistribution1,
  ApprovalAccount2,
  ApprovalApprovedDistribution2,
  ApprovalAccount3,
  ApprovalApprovedDistribution3,
  ApprovalAccount4,
  ApprovalApprovedDistribution4,
  MiniumApprovalCount,
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
    const qnt = this.view.getVariableAsDecimal(PoolContractDataIndex.PaidRESTC);
    return parseFloat(toStableCoinAmount(qnt));
  }

  getDistributionApprovalStatus(): ApprovalStatus {
    const approvedAccounts = [];
    const approved1 = this.getApprovedAccount(
      PoolContractDataIndex.ApprovalApprovedDistribution1,
      PoolContractDataIndex.ApprovalAccount1
    );
    const approved2 = this.getApprovedAccount(
      PoolContractDataIndex.ApprovalApprovedDistribution2,
      PoolContractDataIndex.ApprovalAccount2
    );
    const approved3 = this.getApprovedAccount(
      PoolContractDataIndex.ApprovalApprovedDistribution3,
      PoolContractDataIndex.ApprovalAccount3
    );
    const approved4 = this.getApprovedAccount(
      PoolContractDataIndex.ApprovalApprovedDistribution4,
      PoolContractDataIndex.ApprovalAccount4
    );

    approved1 && approvedAccounts.push(approved1);
    approved2 && approvedAccounts.push(approved2);
    approved3 && approvedAccounts.push(approved3);
    approved4 && approvedAccounts.push(approved4);

    const quantity = toStableCoinAmount(
      this.view.getVariableAsDecimal(
        PoolContractDataIndex.PendingDistributionRESTC
      )
    );

    return {
      approvedAccounts,
      quantity: quantity,
    };
  }
}
