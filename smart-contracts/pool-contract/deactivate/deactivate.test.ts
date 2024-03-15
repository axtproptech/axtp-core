import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {Deactivate, DeactivateNotAuthorized} from "./deactivate.scenarios";


describe('Pool Contract - Update GMV', () => {
    test('should deactivate, getting funds back, and new transfers refund directly', () => {
        const testbed = new SimulatorTestbed(Deactivate)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();
        const getAxtcTokenBalance = (accountId: bigint) => {
            return testbed.getAccount(accountId)?.tokens.find( ({asset}) => asset === Context.AxtcTokenId)?.quantity ?? 0n
        }

        expect( testbed.getContractMemoryValue("isDeactivated") ).toBe(1n);
        expect(getAxtcTokenBalance(Context.MasterContract)).toBe(200n);

        let tx = testbed.getTransactions();
        // creator should have receive SIGNA from the contract
        expect(tx.some( ({sender, recipient, amount}) => sender === Context.ThisContract && recipient === Context.CreatorAccount && amount > 10_0000_0000n)).toBeTruthy()
        expect(testbed.getAccount(Context.ThisContract)?.balance).toBe(0n)

        testbed.sendTransactionAndGetResponse([
            {
                blockheight: 5,
                amount: 1_0000_0000n,
                tokens: [
                    {
                        asset: 101010n,
                        quantity: 20n
                    }
                ],
                sender: Context.ApproverAccount[0],
                messageArr: [Context.Methods.UpdateGrossMarketValue, 200n],
                recipient: Context.ThisContract,
            },
            {
                blockheight: 6,
                amount: 1_0000_0000n,
                sender: Context.ApproverAccount[2],
                messageArr: [Context.Methods.SendAXTPToHolder, 2n],
                recipient: Context.ThisContract,
            },
        ])

        tx = testbed.getTransactions();
        expect(tx[tx.length - 1].recipient).toBe(Context.CreatorAccount);
        expect(tx[tx.length - 1].amount).toBeGreaterThan(1_0000_0000n);
        expect(tx[tx.length - 2].recipient).toBe(Context.ApproverAccount[0]);
        expect(tx[tx.length - 2].amount).toBe(0n);
        expect(tx[tx.length - 2].tokens).toEqual([
            {
                asset: 101010n,
                quantity: 20n,
            }
        ]);
        expect(tx[tx.length - 3].recipient).toBe(Context.ApproverAccount[0]);
        expect(tx[tx.length - 3].amount).toBe(1_0000_0000n - Context.ActivationFee);

    })
    test('should not allow to deactivate', () => {
        const testbed = new SimulatorTestbed(DeactivateNotAuthorized)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        expect( testbed.getContractMemoryValue("isDeactivated") ).toBe(0n);
        expect(testbed
            .getTransactions()
            .some( ({sender, recipient, amount}) => sender === Context.ThisContract && recipient === Context.CreatorAccount)
        ).toBeFalsy()
    })
})
