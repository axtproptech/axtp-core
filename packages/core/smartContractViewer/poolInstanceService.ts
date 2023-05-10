import { ServiceContext } from "./serviceContext";
import { withError } from "./withError";
import { Amount, ChainValue } from "@signumjs/util";
import { PoolContractDataView } from "./poolContractDataView";
import { GenericContractViewerService } from "./genericContractViewerService";
import { AxtcContractService } from "./axtcContractService";
import { PoolContractData } from "./poolContractData";

export class PoolInstanceService extends GenericContractViewerService {
  constructor(
    context: ServiceContext,
    private masterContractService: AxtcContractService,
    private poolId: string
  ) {
    super(context);
  }

  contractId(): string {
    return this.poolId;
  }

  public readContractData() {
    return withError<PoolContractData>(async () => {
      const { ledger } = this.context;
      const masterContractData =
        await this.masterContractService.readContractData();
      const contract = await ledger.contract.getContract(this.poolId);
      const contractDataView = new PoolContractDataView(contract);
      const [token, masterToken, tokenBalances] = await Promise.all([
        this.getTokenData(contractDataView.getPoolTokenId()),
        this.getTokenData(masterContractData.token.id),
        this.getTokenBalances(),
      ]);

      const pendingDistribution = ChainValue.create(2)
        .setAtomic(
          tokenBalances.find((a) => a.asset === masterContractData.token.id)
            ?.unconfirmedBalanceQNT || "0"
        )
        .getCompound();

      const approvalStatusDistribution =
        contractDataView.getDistributionApprovalStatus();
      approvalStatusDistribution.quantity = pendingDistribution;

      const approvalStatusRefund = contractDataView.getRefundApprovalStatus();
      const pendingRefund = ChainValue.create(2)
        .setAtomic(approvalStatusRefund.quantity)
        .getCompound();
      return {
        isDeactivated: contractDataView.getIsDeactivated(),
        poolId: this.poolId,
        balance: Amount.fromPlanck(contract.balanceNQT).getSigna(),
        token,
        masterToken,
        approvalStatusDistribution,
        pendingDistribution: Number(pendingDistribution),
        paidDistribution: contractDataView.getDistributedStableCoins(),
        maxShareQuantity: contractDataView.getPoolTokenMaxQuantity(),
        nominalLiquidity: contractDataView.getNominalLiquidity(),
        tokenRate: contractDataView.getPoolTokenRate(),
        grossMarketValue: contractDataView.getGrossMarketValue(),
        approvalStatusRefund,
        pendingRefund: Number(pendingRefund),
      };
    });
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
        this.masterContractService.readContractData(),
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
            balanceAXTC: ChainValue.create(2)
              // @ts-ignore
              .setAtomic(relevantAssets[axtcTokenId] || 0)
              .getCompound(),
            // @ts-ignore
            balanceAXTP: relevantAssets[tokenId] || "0",
          };
        }
      );
    });
  }
}
