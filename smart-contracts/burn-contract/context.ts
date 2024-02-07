import {join} from 'path';

export const Context = {
    CodeHashId: 10089491455344783515n,
    ContractPath: join(__dirname + '/burn-contract.smart.c'),
    SenderAccount1: 10n,
    SenderAccount2: 20n,
    CreditorAccount: [300n, 301n],
    CreatorAccount: 555n,
    ThisContract: 999n,
    ActivationFee: 2500_0000n,
    Tokens: [10001n,10002n,10003n],
    Methods: {
        AddTrackableToken: 1n,
        RemoveTrackableToken: 2n,
        CreditTrackableToken: 3n,
        AddCreditor: 4n,
        RemoveCreditor: 5n,

    },
    Maps: {
        TrackableTokens: 1n,
        CreditorAccounts: 2n,
        // other map is dynamic by token ids
    }
}
