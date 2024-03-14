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
export const ApproveRefunding50AXTC = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: 1000_0000n,
        sender: 100n, // some sender, does not need to be an AXT member
        tokens: [{
            asset: Context.AxtcTokenId,
            quantity: 100n
        },{
            asset: 102020n, // some aleatory token
            quantity: 10n
        }],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.RequestAXTCRefund, 50n],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 5,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.ApproveAXTCRefund],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 5,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[1],
        messageArr: [Context.Methods.ApproveAXTCRefund],
        recipient: Context.ThisContract,
    },
    // skip ApproverAccount 2 - as only 3/4 is needed
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[3],
        messageArr: [Context.Methods.ApproveAXTCRefund],
        recipient: Context.ThisContract,
    }
]
export const OverwriteRefundingRequest = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: 1000_0000n,
        sender: 100n, // some sender, does not need to be an AXT member
        tokens: [{
            asset: Context.AxtcTokenId,
            quantity: 100n
        },{
            asset: 102020n, // some aleatory token
            quantity: 10n
        }],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.RequestAXTCRefund, 50n],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 5,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.ApproveAXTCRefund],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 5,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[1],
        messageArr: [Context.Methods.ApproveAXTCRefund],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[2],
        messageArr: [Context.Methods.RequestAXTCRefund, 5n], // overwrite
        recipient: Context.ThisContract,
    }
]

export const RequestFundingNotAllowed = [
    ...InitialTransactions,
    {
        blockheight: 3,
        amount: 1000_0000n,
        sender: 100n, // some sender, does not need to be an AXT member
        tokens: [{
            asset: Context.AxtcTokenId,
            quantity: 100n
        },{
            asset: 102020n, // some aleatory token
            quantity: 10n
        }],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 4,
        amount: Context.ActivationFee,
        sender: 100n, // some aleatory account
        messageArr: [Context.Methods.RequestAXTCRefund, 50n],
        recipient: Context.ThisContract,
    },
    // approvals do nothing
    {
        blockheight: 5,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[0],
        messageArr: [Context.Methods.ApproveAXTCRefund],
        recipient: Context.ThisContract,
    },
    {
        blockheight: 5,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[1],
        messageArr: [Context.Methods.ApproveAXTCRefund],
        recipient: Context.ThisContract,
    },
    // skip ApproverAccount 2 - as only 3/4 is needed
    {
        blockheight: 6,
        amount: Context.ActivationFee,
        sender: Context.ApproverAccount[3],
        messageArr: [Context.Methods.ApproveAXTCRefund],
        recipient: Context.ThisContract,
    }
]


