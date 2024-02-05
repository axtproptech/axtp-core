import {join} from 'path';

export const Context = {
    ContractPath: join(__dirname + '/burn-contract.smart.c'),
    SenderAccount1: 10n,
    SenderAccount2: 20n,
    CreatorAccount: 555n,
    ThisContract: 999n,
    ActivationFee: 2000_0000n,
    Tokens: [10001n,10002n,10003n],
    Methods: {
        AddTrackableToken: 1n,
        RemoveTrackableToken: 2n,
        CreditTrackableToken: 3n
    },
    Maps: {
        TrackableTokens: 1n,
        // other map is dynamic by token ids
    }
}
