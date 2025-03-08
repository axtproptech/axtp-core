import {Context} from '../context';
import {TransactionObj} from 'signum-smartc-testbed';

export const AddTrackableTokens: TransactionObj[] = [
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
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.AddTrackableToken, Context.Tokens[0]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.AddTrackableToken, Context.Tokens[1]],
        recipient: Context.ThisContract,
    },
]

export const AddTrackableTokensNotAllowed: TransactionObj[] = [
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
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        messageArr: [Context.Methods.AddTrackableToken, Context.Tokens[0]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        messageArr: [Context.Methods.AddTrackableToken, Context.Tokens[1]],
        recipient: Context.ThisContract,
    },
]
