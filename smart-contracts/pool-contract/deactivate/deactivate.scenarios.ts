import {Context} from '../context';
import {TransactionObj} from 'signum-smartc-testbed';

export const InitialTransactions: TransactionObj[] = [
    {
        blockheight: 1,
        amount: 160_0000_0000n, // charge - need to issue token
        sender: Context.CreatorAccount,
        recipient: Context.ThisContract,
    },
    {
        blockheight: 2,
        amount: 1000_0000_0000n,
        sender: Context.TokenHolderAccount[1], // sends back
        tokens: [
            {
                asset: Context.AxtcTokenId,
                quantity: 200n
            }
        ],
        recipient: Context.ThisContract,
    }
]
export const Deactivate = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: Context.ActivationFee,
        sender: Context.CreatorAccount,
        messageArr: [Context.Methods.Deactivate],
        recipient: Context.ThisContract,
    }
]

export const DeactivateNotAuthorized = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: Context.ActivationFee,
        sender: 100n, // not allowed
        messageArr: [Context.Methods.Deactivate],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 3,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0], // not even approver
        messageArr: [Context.Methods.Deactivate, 100n],
        recipient: Context.ThisContract,
    }
]
