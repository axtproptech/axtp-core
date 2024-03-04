import {Context} from '../context';
import {asHexMessage, TransactionObj} from 'signum-smartc-testbed';


export const InitialTransactions = [
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
]
export const RemoveTrackableTokens: TransactionObj[] = [
    ...InitialTransactions,
    {
        blockheight: 1,
        amount: 1_0000_0000n, // charge
        tokens: [
            {asset: Context.Tokens[0], quantity: 1000_0000n},
            {asset: Context.Tokens[1], quantity: 2000_0000n},
            {asset: Context.Tokens[2], quantity: 3000_0000n},
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
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.RemoveTrackableToken, Context.Tokens[0]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.RemoveTrackableToken, Context.Tokens[1]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.RemoveTrackableToken, Context.Tokens[2]],
        recipient: Context.ThisContract,
    },
]

export const RemoveTrackableTokensNotAllowed: TransactionObj[] = [
    ...InitialTransactions,
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
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        messageArr: [Context.Methods.RemoveTrackableToken, Context.Tokens[1]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        messageArr: [Context.Methods.RemoveTrackableToken, Context.Tokens[0]],
        recipient: Context.ThisContract,
    },
]
