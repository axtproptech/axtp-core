import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {
    SendAXTPToTokenHolderNotAuthorized,
    SendAXTPToTokenHolderSomeBalance,
    SendAXTPToTokenHolderZeroBalance,
    SendZeroAXTPToTokenHolder
} from "./send-axtp-to-tokenholder.scenarios";


describe('Pool Contract - Send AXTP to Token Holders', () => {
    test('should mint tokens if no balance exists and send to account', () => {
        const testbed = new SimulatorTestbed(SendAXTPToTokenHolderZeroBalance)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        const poolTokenId = testbed.getContractMemoryValue("poolTokenId")
        const tokenHolder1 = testbed.getAccount(Context.TokenHolderAccount[0]);
        expect(tokenHolder1?.tokens).toMatchObject([
            {
                asset: poolTokenId,
                quantity: 10n
            }
        ])
        expect(testbed.getAccount(Context.ThisContract)?.tokens).toMatchObject([
            {
                asset: poolTokenId,
                quantity: 0n
            }
        ]);
    })
    test('should mint tokens if but use part of existing balance send to account', () => {
        const testbed = new SimulatorTestbed(SendAXTPToTokenHolderSomeBalance)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 13, // exact minting
            })
            .runScenario();

        const poolTokenId = testbed.getContractMemoryValue("poolTokenId")
        const tokenHolder1 = testbed.getAccount(Context.TokenHolderAccount[0]);
        expect(tokenHolder1?.tokens).toMatchObject([
            {
                asset: poolTokenId,
                quantity: 10n
            }
        ])
        const tokenHolder2 = testbed.getAccount(Context.TokenHolderAccount[1]);
        expect(tokenHolder2?.tokens).toMatchObject([
            {
                asset: poolTokenId,
                quantity: 3n
            }
        ])
        expect(testbed.getAccount(Context.ThisContract)?.tokens).toMatchObject([
            {
                asset: poolTokenId,
                quantity: 0n
            }
        ]);
    })
    test('should not mint tokens as limit is reached', () => {
        const testbed = new SimulatorTestbed(SendAXTPToTokenHolderSomeBalance)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 10, // exact minting
            })
            .runScenario();

        const poolTokenId = testbed.getContractMemoryValue("poolTokenId")
        expect(testbed.getAccount(Context.TokenHolderAccount[0])).toBeNull();
        const tokenHolder2 = testbed.getAccount(Context.TokenHolderAccount[1]);
        expect(tokenHolder2?.tokens).toMatchObject([
            {
                asset: poolTokenId,
                quantity: 3n
            }
        ])
        expect(testbed.getAccount(Context.ThisContract)?.tokens).toMatchObject([
            {
                asset: poolTokenId,
                quantity: 2n
            }
        ]);
        const tx = testbed.getTransactions();
        expect(tx[tx.length-1].messageText).toEqual("Not enough Pool Tokens left")

    })
    test('should not send anything when requesting 0 AXTP to be sent', () => {
        const testbed = new SimulatorTestbed(SendZeroAXTPToTokenHolder)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 10, // exact minting
            })
            .runScenario();

        expect(testbed.getAccount(Context.TokenHolderAccount[0])).toBeNull();
        expect(testbed.getTransactions().length).toBe(3)

    })
    test('should not be authorized to send anything', () => {
        const testbed = new SimulatorTestbed(SendAXTPToTokenHolderNotAuthorized)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 10, // exact minting
            })
            .runScenario();

        expect(testbed.getAccount(Context.TokenHolderAccount[0])).toBeNull();
        expect(testbed.getTransactions().length).toBe(3)
    })
})
