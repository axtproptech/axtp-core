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
export const RemoveCreditorAccounts: TransactionObj[] = [
    ...InitialTransactions,
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
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.RemoveCreditor, Context.CreditorAccount[0]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.RemoveCreditor, Context.CreditorAccount[1]],
        recipient: Context.ThisContract,
    },
]

export const RemoveCreditorAccontsNotAllowed: TransactionObj[] = [
    ...InitialTransactions,
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
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[0],
        messageArr: [Context.Methods.RemoveCreditor, Context.CreditorAccount[1]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 5,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        messageArr: [Context.Methods.RemoveCreditor, Context.CreditorAccount[0]],
        recipient: Context.ThisContract,
    },
]
