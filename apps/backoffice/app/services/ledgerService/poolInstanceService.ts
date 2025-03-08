import { ServiceContext } from "./serviceContext";
import { Config } from "@/app/config";
import { Amount, ChainValue } from "@signumjs/util";
import { InputValidationService } from "../inputValidationService";
import { GenericContractService } from "./genericContractService";
import { PoolContractData } from "@/types/poolContractData";
import { AxtcContractService } from "./axtcContractService";
import { toStableCoinAmount } from "@/app/tokenQuantity";
import { DescriptorData } from "@signumjs/standards";
import { withError } from "@axtp/core";
import { PoolContractDataView } from "@axtp/core/smartContractViewer";

// TODO: refactor to use shared core package

export class PoolInstanceService extends GenericContractService {
  constructor(
    context: ServiceContext,
    private axtcContractService: AxtcContractService,
    private poolId: string
  ) {
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

  public fetchDescriptor() {
    return withError<DescriptorData>(async () => {
      const { ledger } = this.context;
      const contract = await ledger.contract.getContract(this.poolId);
      return DescriptorData.parse(contract.description);
    });
  }

  public readContractData() {
    return withError<PoolContractData>(async () => {
      const { ledger } = this.context;
      const masterContractData =
        await this.axtcContractService.readContractData();
      const contract = await ledger.contract.getContract(this.poolId);
      const contractDataView = new PoolContractDataView(contract);
      const [token, masterToken, transactions, tokenBalances] =
        await Promise.all([
          this.getTokenData(contractDataView.getPoolTokenId()),
          this.getTokenData(masterContractData.token.id),
          ledger.account.getAccountTransactions({
            accountId: this.contractId(),
          }),
          this.getTokenBalances(),
        ]);

      const pendingDistribution = toStableCoinAmount(
        tokenBalances.find((a) => a.asset === masterContractData.token.id)
          ?.unconfirmedBalanceQNT || "0"
      );

      const approvalStatusDistribution =
        contractDataView.getDistributionApprovalStatus();
      approvalStatusDistribution.quantity = pendingDistribution;

      const approvalStatusRefund = contractDataView.getRefundApprovalStatus();
      const pendingRefund = toStableCoinAmount(approvalStatusRefund.quantity);
      const descriptor = DescriptorData.parse(contract.description);
      const goal = ChainValue.create(masterToken.decimals)
        .setAtomic((descriptor.getCustomField("x-goal") as string) || "0")
        .getCompound();
      const isPublic =
        ((descriptor.getCustomField("x-pub") as string) || "0") === "1";

      return {
        isDeactivated: contractDataView.getIsDeactivated(),
        poolId: this.poolId,
        balance: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        token,
        masterToken,
        transactions: transactions.transactions,
        approvalStatusDistribution,
        pendingDistribution: Number(pendingDistribution),
        paidDistribution: contractDataView.getDistributedStableCoins(),
        maxShareQuantity: contractDataView.getPoolTokenMaxQuantity(),
        nominalLiquidity: contractDataView.getNominalLiquidity(),
        tokenRate: contractDataView.getPoolTokenRate(),
        grossMarketValue: contractDataView.getGrossMarketValue(),
        approvalStatusRefund,
        pendingRefund: Number(pendingRefund),
        goal: Number(goal),
        isPublic,
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

  public async updateGrossMarketValue(gmvQuantity: number) {
    InputValidationService.assertNumberGreaterOrEqualThan(0, gmvQuantity);
    return this.callMethod(
      Config.PoolContract.Methods.UpdateGrossMarketValue,
      gmvQuantity
    );
  }

  public async requestAXTCRefund(axtcQuantity: number) {
    InputValidationService.assertNumberGreaterOrEqualThan(0, axtcQuantity);
    return this.callMethod(
      Config.PoolContract.Methods.RequestAXTCRefund,
      axtcQuantity
    );
  }

  public async approveAXTCRefund() {
    return this.callMethod(Config.PoolContract.Methods.ApproveAXTCRefund);
  }

  public async getAllTokenHolders(
    tokenId: string,
    firstIndex?: number,
    lastIndex?: number
  ) {
    return withError(async () => {
      const { ledger } = this.context;
      const [{ accountAssets }, masterContractData] = await Promise.all([
        ledger.asset.getAssetHolders({
          assetId: tokenId,
          ignoreTreasuryAccount: true,
          firstIndex,
          lastIndex,
        }),
        this.axtcContractService.readContractData(),
      ]);
      const accountRequests = accountAssets.map(({ account }) =>
        ledger.account.getAccount({
          accountId: account,
          includeEstimatedCommitment: false,
          includeCommittedAmount: false,
        })
      );
      const axtcTokenId = masterContractData.token.id;
      const accounts = await Promise.all(accountRequests);

      return accounts.map(
        ({
          unconfirmedAssetBalances,
          unconfirmedBalanceNQT,
          publicKey,
          account,
          accountRS,
        }) => {
          const relevantAssets = unconfirmedAssetBalances
            .filter(({ asset }) => asset === tokenId || asset === axtcTokenId)
            .reduce(
              (res, { asset, unconfirmedBalanceQNT }) => ({
                ...res,
                [asset]: unconfirmedBalanceQNT,
              }),
              {}
            );
          return {
            publicKey,
            account,
            accountRS,
            balanceSigna: Amount.fromPlanck(unconfirmedBalanceNQT).getSigna(),
            // @ts-ignore
            balanceAXTC: toStableCoinAmount(relevantAssets[axtcTokenId] || 0),
            // @ts-ignore
            balanceAXTP: relevantAssets[tokenId] || "0",
          };
        }
      );
    });
  }
}
