import {Context} from '../context';
import {asHexMessage, UserTransactionObj} from 'signum-smartc-testbed';

export const InitialTransactions: UserTransactionObj[] = [
    {
        blockheight: 1,
        amount: 1_0000_0000n, // charge
        sender: Context.CreatorAccount,
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageHex: asHexMessage([Context.Methods.AddTrackableToken, Context.Tokens[0]]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageHex: asHexMessage([Context.Methods.AddTrackableToken, Context.Tokens[1]]),
        recipient: Context.ThisContract,
    },
]
export const BurnTokens = [
    ...InitialTransactions,
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        tokens: [
            { asset: Context.Tokens[0], quantity: 100n },
            { asset: Context.Tokens[1], quantity: 200n },
            { asset: Context.Tokens[2], quantity: 300n },
        ],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        tokens: [
            { asset: Context.Tokens[0], quantity: 10n },
            { asset: Context.Tokens[1], quantity: 20n },
            { asset: Context.Tokens[2], quantity: 30n }
        ],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 8,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount2,
        tokens: [
            { asset: Context.Tokens[0], quantity: 50n },
            { asset: Context.Tokens[1], quantity: 60n },
            { asset: Context.Tokens[2], quantity: 70n }
        ],
        recipient: Context.ThisContract,
    },
]