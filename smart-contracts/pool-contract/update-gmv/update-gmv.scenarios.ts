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
export const UpdateGMV = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.UpdateGrossMarketValue, 100n],
        recipient: Context.ThisContract,
    },
]

export const UpdateGMVNotAuthorized = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: Context.ActivationFee,
        sender: 100n, // not allowed
        messageArr: [Context.Methods.UpdateGrossMarketValue, 100n],
        recipient: Context.ThisContract,
    },
]
