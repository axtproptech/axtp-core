import {Context} from '../context';
import {asHexMessage, UserTransactionObj} from 'signum-smartc-testbed';

export const AddTrackableTokens: UserTransactionObj[] = [
    {
        blockheight: 1,
        amount: 1_0000_0000n, // charge
        tokens: [
            {asset: Context.Tokens[0], quantity: 1000_0000n},
            {asset: Context.Tokens[1], quantity: 2000_0000n},
            {asset: Context.Tokens[2], quantity: 2000_0000n},
        ],
        sender: Context.CreatorAccount,
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: 2000_0000n,
        sender: Context.CreatorAccount,
        messageHex: asHexMessage([Context.Methods.AddTrackableToken, Context.Tokens[0]]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: 2000_0000n,
        sender: Context.CreatorAccount,
        messageHex: asHexMessage([Context.Methods.AddTrackableToken, Context.Tokens[1]]),
        recipient: Context.ThisContract,
    },
]

export const AddTrackableTokensNotAllowed: UserTransactionObj[] = [
    {
        blockheight: 1,
        amount: 1_0000_0000n, // charge
        tokens: [
            {asset: Context.Tokens[0], quantity: 1000_0000n},
            {asset: Context.Tokens[1], quantity: 2000_0000n},
            {asset: Context.Tokens[2], quantity: 2000_0000n},
        ],
        sender: Context.CreatorAccount,
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: 2000_0000n,
        sender: Context.SenderAccount1,
        messageHex: asHexMessage([Context.Methods.AddTrackableToken, Context.Tokens[0]]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: 2000_0000n,
        sender: Context.SenderAccount1,
        messageHex: asHexMessage([Context.Methods.AddTrackableToken, Context.Tokens[1]]),
        recipient: Context.ThisContract,
    },
]
