import {Context} from '../context';
import {TransactionObj} from 'signum-smartc-testbed';

export const InitialTransactions: TransactionObj[] = [
    {
        blockheight: 1,
        amount: 160_0000_0000n, // charge - need to issue token
        sender: Context.CreatorAccount,
        recipient: Context.ThisContract,
    },
]
export const SendAXTPToTokenHolderZeroBalance = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.SendAXTPToHolder, Context.TokenHolderAccount[0], 10n],
        recipient: Context.ThisContract,
    },
]

export const SendAXTPToTokenHolderSomeBalance = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.SendAXTPToHolder, Context.TokenHolderAccount[1], 5n], // mints 5
        recipient: Context.ThisContract,
    },
    {
        blockheight: 5,
        amount: 1000_000n,
        sender: Context.TokenHolderAccount[1], // sends back
        tokens: [
            {
                asset: 101010n,
                quantity: 2n
            }
        ],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 8,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.SendAXTPToHolder, Context.TokenHolderAccount[0], 10n], // mints 8
        recipient: Context.ThisContract,
    },
]

export const SendZeroAXTPToTokenHolder = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.SendAXTPToHolder, Context.TokenHolderAccount[0], 0n],
        recipient: Context.ThisContract,
    },
]

export const SendAXTPToTokenHolderNotAuthorized = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: Context.ActivationFee,
        sender: 100n, // some aleatory account
        messageArr: [Context.Methods.SendAXTPToHolder, Context.TokenHolderAccount[0], 10n],
        recipient: Context.ThisContract,
    },
]
