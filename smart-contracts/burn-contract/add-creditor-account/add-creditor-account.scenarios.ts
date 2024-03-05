import {Context} from '../context';
import {asHexMessage, TransactionObj} from 'signum-smartc-testbed';

export const AddCreditorAccounts: TransactionObj[] = [
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
]

export const AddCreditorAccountsNotAllowed: TransactionObj[] = [
    {
        blockheight: 1,
        amount: 1_0000_0000n, // charge
        sender: Context.CreatorAccount,
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.SenderAccount1,
        messageArr: [Context.Methods.AddCreditor, Context.CreditorAccount[1]],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[1],
        messageArr: [Context.Methods.AddCreditor, Context.CreditorAccount[0]],
        recipient: Context.ThisContract,
    },
]
