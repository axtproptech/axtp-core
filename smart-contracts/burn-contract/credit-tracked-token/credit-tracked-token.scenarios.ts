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
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageHex: asHexMessage([Context.Methods.AddTrackableToken, Context.Tokens[2]]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageHex: asHexMessage([Context.Methods.AddCreditor, Context.CreditorAccount[0]]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageHex: asHexMessage([Context.Methods.AddCreditor, Context.CreditorAccount[1]]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        tokens: [
            { asset: Context.Tokens[0], quantity: 10n },
            { asset: Context.Tokens[1], quantity: 100n },
            { asset: Context.Tokens[2], quantity: 1000n },
        ],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount2,
        tokens: [
            { asset: Context.Tokens[0], quantity: 20n },
            { asset: Context.Tokens[1], quantity: 200n },
            { asset: Context.Tokens[2], quantity: 2000n },
        ],
        recipient: Context.ThisContract,
    },
]
export const CreditTrackedTokens = [
    ...InitialTransactions,

    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageHex: asHexMessage([Context.Methods.CreditTrackableToken, Context.Tokens[0], 5n, Context.SenderAccount1]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[1],
        messageHex: asHexMessage([Context.Methods.CreditTrackableToken, Context.Tokens[1], 10n, Context.SenderAccount1]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[1],
        messageHex: asHexMessage([Context.Methods.CreditTrackableToken, Context.Tokens[2], 200n, Context.SenderAccount2]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 7,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageHex: asHexMessage([Context.Methods.CreditTrackableToken, Context.Tokens[1], 300n, Context.SenderAccount2]), // 300n is too much
        recipient: Context.ThisContract,
    },
]

export const CreditTrackedTokensEvenWhenUntracked = [
    ...InitialTransactions,
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageHex: asHexMessage([Context.Methods.CreditTrackableToken, Context.Tokens[0], 5n, Context.SenderAccount1]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 7,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageHex: asHexMessage([Context.Methods.RemoveTrackableToken, Context.Tokens[0]]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 8,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageHex: asHexMessage([Context.Methods.CreditTrackableToken, Context.Tokens[0], 2n, Context.SenderAccount1]),
        recipient: Context.ThisContract,
    },
]

export const CreditTrackedTokensEvenWithZeroBalance = [
    ...InitialTransactions.slice(0, 4),
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageHex: asHexMessage([Context.Methods.CreditTrackableToken, Context.Tokens[0], 5n, Context.SenderAccount1]),
        recipient: Context.ThisContract,
    },
]

export const CreditTrackedTokensNotAllowed = [
    ...InitialTransactions,
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        messageHex: asHexMessage([Context.Methods.CreditTrackableToken, Context.Tokens[0], 5n, Context.SenderAccount1]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageHex: asHexMessage([Context.Methods.RemoveCreditor, Context.CreditorAccount[0]]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 8,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageHex: asHexMessage([Context.Methods.CreditTrackableToken, Context.Tokens[0], 5n, Context.SenderAccount1]),
        recipient: Context.ThisContract,
    },
]