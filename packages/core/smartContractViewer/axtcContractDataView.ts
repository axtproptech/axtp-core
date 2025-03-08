import { Contract, ContractDataView } from "@signumjs/contracts";
import { ApprovalStatus } from "./approvalStatus";
import { ChainValue } from "@signumjs/util";

enum MasterContractDataIndex {
  TokenId = 5,
  PendingMintToken,
  PendingBurnToken,
  PendingSendToPoolToken,
  RequestedSendToPoolAddress,
  IsDeactivated = 15,
  ApprovalAccount1 = 17,
  ApprovalApprovedMint1,
  ApprovalApprovedBurn1,
  ApprovalApprovedSendToPool1,
  ApprovalAccount2,
  ApprovalApprovedMint2,
  ApprovalApprovedBurn2,
  ApprovalApprovedSendToPool2,
  ApprovalAccount3,
  ApprovalApprovedMint3,
  ApprovalApprovedBurn3,
  ApprovalApprovedSendToPool3,
  ApprovalAccount4,
  ApprovalApprovedMint4,
  ApprovalApprovedBurn4,
  ApprovalApprovedSendToPool4,
  MiniumApprovalCount,
}

export class AxtcContractDataView {
  private readonly view: ContractDataView;
  private readonly id: string;

  constructor(contract: Contract) {
    this.id = contract.at;
    this.view = new ContractDataView(contract);
  }

  private getApprovedAccount(
    approvalIndex: MasterContractDataIndex,
    accountIndex: MasterContractDataIndex
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

  getTokenId(): string {
    return this.view.getVariableAsDecimal(MasterContractDataIndex.TokenId);
  }

  getIsDeactivated(): boolean {
    return (
      Number(
        this.view.getVariableAsDecimal(MasterContractDataIndex.IsDeactivated)
      ) === 1
    );
  }

  getCurrentPoolAddress(): string {
    return this.view.getVariableAsDecimal(
      MasterContractDataIndex.RequestedSendToPoolAddress
    );
  }

  getMintingApprovalStatus(): ApprovalStatus {
    const approvedAccounts = [];
    const approved1 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedMint1,
      MasterContractDataIndex.ApprovalAccount1
    );
    const approved2 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedMint2,
      MasterContractDataIndex.ApprovalAccount2
    );
    const approved3 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedMint3,
      MasterContractDataIndex.ApprovalAccount3
    );
    const approved4 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedMint4,
      MasterContractDataIndex.ApprovalAccount4
    );

    approved1 && approvedAccounts.push(approved1);
    approved2 && approvedAccounts.push(approved2);
    approved3 && approvedAccounts.push(approved3);
    approved4 && approvedAccounts.push(approved4);

    const quantity = ChainValue.create(2)
      .setAtomic(
        this.view.getVariableAsDecimal(MasterContractDataIndex.PendingMintToken)
      )
      .getCompound();

    return {
      approvedAccounts,
      quantity,
    };
  }

  getBurningApprovalStatus(): ApprovalStatus {
    const approvedAccounts = [];
    const approved1 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedBurn1,
      MasterContractDataIndex.ApprovalAccount1
    );
    const approved2 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedBurn2,
      MasterContractDataIndex.ApprovalAccount2
    );
    const approved3 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedBurn3,
      MasterContractDataIndex.ApprovalAccount3
    );
    const approved4 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedBurn4,
      MasterContractDataIndex.ApprovalAccount4
    );

    approved1 && approvedAccounts.push(approved1);
    approved2 && approvedAccounts.push(approved2);
    approved3 && approvedAccounts.push(approved3);
    approved4 && approvedAccounts.push(approved4);

    const quantity = ChainValue.create(2)
      .setAtomic(
        this.view.getVariableAsDecimal(MasterContractDataIndex.PendingBurnToken)
      )
      .getCompound();

    return {
      approvedAccounts,
      quantity,
    };
  }

  getSendingToPoolApprovalStatus(): ApprovalStatus {
    const approvedAccounts = [];
    const approved1 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedSendToPool1,
      MasterContractDataIndex.ApprovalAccount1
    );
    const approved2 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedSendToPool2,
      MasterContractDataIndex.ApprovalAccount2
    );
    const approved3 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedSendToPool3,
      MasterContractDataIndex.ApprovalAccount3
    );
    const approved4 = this.getApprovedAccount(
      MasterContractDataIndex.ApprovalApprovedSendToPool4,
      MasterContractDataIndex.ApprovalAccount4
    );

    approved1 && approvedAccounts.push(approved1);
    approved2 && approvedAccounts.push(approved2);
    approved3 && approvedAccounts.push(approved3);
    approved4 && approvedAccounts.push(approved4);

    const quantity = ChainValue.create(2)
      .setAtomic(
        this.view.getVariableAsDecimal(
          MasterContractDataIndex.PendingSendToPoolToken
        )
      )
      .getCompound();

    return {
      approvedAccounts,
      quantity,
    };
  }
}
