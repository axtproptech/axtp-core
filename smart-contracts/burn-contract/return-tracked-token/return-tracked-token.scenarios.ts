import {Context} from '../context';
import {TransactionObj} from 'signum-smartc-testbed';

export const InitialTransactions: TransactionObj[] = [
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
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.AddTrackableToken, Context.Tokens[2]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.AddCreditor, Context.CreditorAccount[0]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.AddCreditor, Context.CreditorAccount[1]],
        recipient: Context.ThisContract,
    },

    {
        blockheight: 2,
        amount: 0n,
        sender: 50000n, // some aleatory account
        tokens: [
            {asset: Context.Tokens[0], quantity: 10n},
            {asset: Context.Tokens[1], quantity: 100n},
            {asset: Context.Tokens[2], quantity: 1000n},
        ],
        recipient: Context.SenderAccount1,
    },
    {
        blockheight: 2,
        amount: 0n,
        sender: 50000n, // some
        tokens: [
            {asset: Context.Tokens[0], quantity: 20n},
            {asset: Context.Tokens[1], quantity: 200n},
            {asset: Context.Tokens[2], quantity: 2000n},
        ],
        recipient: Context.SenderAccount2,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        tokens: [
            {asset: Context.Tokens[0], quantity: 10n},
            {asset: Context.Tokens[1], quantity: 100n},
            {asset: Context.Tokens[2], quantity: 1000n},
        ],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount2,
        tokens: [
            {asset: Context.Tokens[0], quantity: 20n},
            {asset: Context.Tokens[1], quantity: 200n},
            {asset: Context.Tokens[2], quantity: 2000n},
        ],
        recipient: Context.ThisContract,
    },
]
export const ReturnTrackedTokens = [
    ...InitialTransactions,

    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageArr: [Context.Methods.ReturnTrackedToken, Context.Tokens[0], 10n, Context.SenderAccount1], // rest 0n
        recipient: Context.ThisContract,
    },
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[1],
        messageArr: [Context.Methods.ReturnTrackedToken, Context.Tokens[1], 80n, Context.SenderAccount1], // rest 20n
        recipient: Context.ThisContract,
    },
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[1],
        messageArr: [Context.Methods.ReturnTrackedToken, Context.Tokens[2], 2100n, Context.SenderAccount2], // sends only 2000n as not having 2100n
        recipient: Context.ThisContract,
    },
    {
        blockheight: 7,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageArr: [Context.Methods.ReturnTrackedToken, Context.Tokens[1], 150n, Context.SenderAccount2], // rest 150n
        recipient: Context.ThisContract,
    },
]

export const ReturnTrackedTokensEvenWhenUntracked = [
    ...InitialTransactions,
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageArr: [Context.Methods.ReturnTrackedToken, Context.Tokens[0], 5n, Context.SenderAccount1],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 7,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageArr: [Context.Methods.RemoveTrackableToken, Context.Tokens[0]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 8,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageArr: [Context.Methods.ReturnTrackedToken, Context.Tokens[0], 2n, Context.SenderAccount1],
        recipient: Context.ThisContract,
    },
]

export const ReturnTrackedTokensEvenWithZeroBalance = [
    ...InitialTransactions.slice(0, 4),
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageArr: [Context.Methods.ReturnTrackedToken, Context.Tokens[0], Context.SenderAccount1],
        recipient: Context.ThisContract,
    },
]

export const ReturnTrackedTokensNotAllowed = [
    ...InitialTransactions,
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        messageArr: [Context.Methods.ReturnTrackedToken, Context.Tokens[0], Context.SenderAccount1],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.RemoveCreditor, Context.CreditorAccount[0]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 8,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageArr: [Context.Methods.ReturnTrackedToken, Context.Tokens[0], Context.SenderAccount1],
        recipient: Context.ThisContract,
    },
]