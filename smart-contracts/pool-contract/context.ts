import {join} from 'path';

export const Context = {
    CodeHashId: 17214688268266988069n,
    ContractPath: join(__dirname + '/pool-contract.smart.c'),
    TokenHolderAccount: [201n, 202n],
    ApproverAccount: [301n, 302n, 303n, 304n],
    CreatorAccount: 555n,
    ThisContract: 999n,
    ActivationFee: 2500_0000n,
    AxtcTokenId: 101011n,
    OtherToken: [10001n,10002n,10003n],
    Methods: {
        SendAXTPToHolder: 1n,
        ApproveDistribution: 2n,
        UpdateGrossMarketValue: 3n,
        RequestAXTCRefund: 4n,
        ApproveAXTCRefund: 5n,
        Deactivate: 99n,

    }
}
