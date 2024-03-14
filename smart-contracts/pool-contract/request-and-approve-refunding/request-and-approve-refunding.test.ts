import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {
    ApproveRefunding50AXTC, OverwriteRefundingRequest, RequestFundingNotAllowed
} from "./request-and-approve-refunding.scenarios";


describe('Pool Contract - Request and Approve Refunding', () => {
    test('should request refunding and send back to master once approved', () => {
        const testbed = new SimulatorTestbed(ApproveRefunding50AXTC)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        const getAxtcTokenBalance = (accountId: bigint) => {
            return testbed.getAccount(accountId)?.tokens.find( ({asset}) => asset === Context.AxtcTokenId)?.quantity ?? 0n
        }
        expect(getAxtcTokenBalance(Context.MasterContract)).toBe(50n);
        expect(getAxtcTokenBalance(Context.ThisContract)).toBe(50n);
        // approvals and request needs to be reset
        expect(testbed.getContractMemoryValue("refundAXTC")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_0_refundingApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_1_refundingApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_2_refundingApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_3_refundingApproved")).toBe(0n);

    })
    test('should ignore refunding request as requester is not allowed', () => {
        const testbed = new SimulatorTestbed(RequestFundingNotAllowed)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        const getAxtcTokenBalance = (accountId: bigint) => {
            return testbed.getAccount(accountId)?.tokens.find( ({asset}) => asset === Context.AxtcTokenId)?.quantity ?? 0n
        }
        expect(getAxtcTokenBalance(Context.MasterContract)).toBe(0n);
        expect(getAxtcTokenBalance(Context.ThisContract)).toBe(100n);
        // nothing to refund
        expect(testbed.getContractMemoryValue("refundAXTC")).toBe(0n);
        // potential approvals ignored
        expect(testbed.getContractMemoryValue("approvals_0_refundingApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_1_refundingApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_2_refundingApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_3_refundingApproved")).toBe(0n);
    })
    test('should overwrite request and reset pending approvals', () => {
        const testbed = new SimulatorTestbed(OverwriteRefundingRequest)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        // approvals and request needs to be reset
        expect(testbed.getContractMemoryValue("refundAXTC")).toBe(5n);
        // pending approvals were reset
        expect(testbed.getContractMemoryValue("approvals_0_refundingApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_1_refundingApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_2_refundingApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_3_refundingApproved")).toBe(0n);
    })
})
