import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {
    ApproveAndDistribute100AXTC,
    ApproveInSingleBlockAndDistribute100AXTC,
    NotFullyApproved,
    NotSendingAsSingleApproverOnlyEvenOnMultipleApprovals,
} from "./approve-distribution.scenarios";


describe('Pool Contract - Approve Distribution', () => {
    test('should send tokens to token holders after successful approval - multi block approval', () => {
        const testbed = new SimulatorTestbed(ApproveAndDistribute100AXTC)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        const getAxtcTokenBalance = (accountId: bigint) => {
            return testbed.getAccount(accountId)?.tokens.find( ({asset}) => asset === Context.AxtcTokenId)?.quantity ?? 0n
        }

        expect(getAxtcTokenBalance(Context.TokenHolderAccount[0])).toBe(67n);
        expect(getAxtcTokenBalance(Context.TokenHolderAccount[1])).toBe(33n);
        const tx = testbed.getTransactions();
        expect(tx[tx.length - 1].messageText).toEqual("Indirect balance/token distributed");
        // approvals needs to be reset
        expect(testbed.getContractMemoryValue("approvals_0_distributionApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_1_distributionApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_2_distributionApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_3_distributionApproved")).toBe(0n);
    })

    test('should send tokens to token holders after successful approval - single block approval', () => {
        const testbed = new SimulatorTestbed(ApproveInSingleBlockAndDistribute100AXTC)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        const getAxtcTokenBalance = (accountId: bigint) => {
            return testbed.getAccount(accountId)?.tokens.find( ({asset}) => asset === Context.AxtcTokenId)?.quantity ?? 0n
        }

        expect(getAxtcTokenBalance(Context.TokenHolderAccount[0])).toBe(67n);
        expect(getAxtcTokenBalance(Context.TokenHolderAccount[1])).toBe(33n);
        const tx = testbed.getTransactions();
        expect(tx[tx.length - 1].messageText).toEqual("Indirect balance/token distributed");
        // approvals needs to be reset
        expect(testbed.getContractMemoryValue("approvals_0_distributionApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_1_distributionApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_2_distributionApproved")).toBe(0n);
        // next is true, because 3/4 approved and now the third is being considered for next approval - this is not 100% ok, but no issue
        expect(testbed.getContractMemoryValue("approvals_3_distributionApproved")).toBe(1n);

    })

    test('should not send any tokens due to non-fulfilled approval', () => {
        const testbed = new SimulatorTestbed(NotFullyApproved)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        const getAxtcTokenBalance = (accountId: bigint) => {
            return testbed.getAccount(accountId)?.tokens.find( ({asset}) => asset === Context.AxtcTokenId)?.quantity ?? 0n
        }
        expect(getAxtcTokenBalance(Context.TokenHolderAccount[0])).toBe(0n);
        expect(getAxtcTokenBalance(Context.TokenHolderAccount[1])).toBe(0n);
        expect(testbed.getTransactions().some( tx => tx.messageText === "Indirect balance/token distributed")).toBeFalsy();
        expect(testbed.getContractMemoryValue("approvals_0_distributionApproved")).toBe(1n);
        expect(testbed.getContractMemoryValue("approvals_1_distributionApproved")).toBe(1n);
        expect(testbed.getContractMemoryValue("approvals_2_distributionApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_3_distributionApproved")).toBe(0n);
    })
    test('should not send any tokens due to non-fulfilled approval - multiple approves by one account only', () => {
        const testbed = new SimulatorTestbed(NotSendingAsSingleApproverOnlyEvenOnMultipleApprovals)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        const getAxtcTokenBalance = (accountId: bigint) => {
            return testbed.getAccount(accountId)?.tokens.find( ({asset}) => asset === Context.AxtcTokenId)?.quantity ?? 0n
        }
        expect(getAxtcTokenBalance(Context.TokenHolderAccount[0])).toBe(0n);
        expect(getAxtcTokenBalance(Context.TokenHolderAccount[1])).toBe(0n);
        expect(testbed.getTransactions().some( tx => tx.messageText === "Indirect balance/token distributed")).toBeFalsy();
        expect(testbed.getContractMemoryValue("approvals_0_distributionApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_1_distributionApproved")).toBe(1n);
        expect(testbed.getContractMemoryValue("approvals_2_distributionApproved")).toBe(0n);
        expect(testbed.getContractMemoryValue("approvals_3_distributionApproved")).toBe(0n);
    })
})
