import {Context} from '../context';
import {asHexMessage, UserTransactionObj} from 'signum-smartc-testbed';

export const AddCreditorAccounts: UserTransactionObj[] = [
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
]

export const AddCreditorAccountsNotAllowed: UserTransactionObj[] = [
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
        messageHex: asHexMessage([Context.Methods.AddCreditor, Context.CreditorAccount[1]]),
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: Context.ActivationFee,
        sender: Context.CreditorAccount[1],
        messageHex: asHexMessage([Context.Methods.AddCreditor, Context.CreditorAccount[0]]),
        recipient: Context.ThisContract,
    },
]
