import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {BurnTokens, BurnTokensWithSuddenlyRemovedTracking} from './burn-tokens.scenarios';


describe('Burn Contract - Burn Tokens', () => {
    test('should register burned tokens as expected', () => {
        const testbed = SimulatorTestbed
            .loadContract(Context.ContractPath)
            .runScenario(BurnTokens);
        let creditsToken0 = testbed.getMapValuePerSlot(Context.Tokens[0], Context.SenderAccount1);
        let creditsToken1 = testbed.getMapValuePerSlot(Context.Tokens[1], Context.SenderAccount1);
        let creditsToken2 = testbed.getMapValuePerSlot(Context.Tokens[2], Context.SenderAccount1);
        let creditsSigna = testbed.getMapValuePerSlot(0n, Context.SenderAccount1);

        const contractAccount = testbed.getAccount(Context.ThisContract);
        expect(contractAccount?.balance).toBeGreaterThan(100_0000_0000n)
        expect(contractAccount?.tokens).toEqual([
                {asset: Context.Tokens[0], quantity: 160n},
                {asset: Context.Tokens[1], quantity: 280n},
                {asset: Context.Tokens[2], quantity: 400n},
            ],
        )

        expect(creditsToken0).toBe(110n);
        expect(creditsToken1).toBe(220n);
        expect(creditsSigna).toBe(0n); // untrackable
        expect(creditsToken2).toBe(0n); // not tracked

        creditsToken0 = testbed.getMapValuePerSlot(Context.Tokens[0], Context.SenderAccount2);
        creditsToken1 = testbed.getMapValuePerSlot(Context.Tokens[1], Context.SenderAccount2);
        creditsToken2 = testbed.getMapValuePerSlot(Context.Tokens[2], Context.SenderAccount2);
        expect(creditsToken0).toBe(50n);
        expect(creditsToken1).toBe(60n);
        expect(creditsToken2).toBe(0n); // not tracked
    })
    test('should register burned tokens as expected - with suddenly removed tracking ', () => {
        const testbed = SimulatorTestbed
            .loadContract(Context.ContractPath)
            .runScenario(BurnTokensWithSuddenlyRemovedTracking);
        let creditsToken0 = testbed.getMapValuePerSlot(Context.Tokens[0], Context.SenderAccount1);
        let creditsToken1 = testbed.getMapValuePerSlot(Context.Tokens[1], Context.SenderAccount1);

        const contractAccount = testbed.getAccount(Context.ThisContract);
        expect(contractAccount?.tokens).toEqual([
                {asset: Context.Tokens[0], quantity: 200n},
                {asset: Context.Tokens[1], quantity: 320n},
            ],
        )
        expect(creditsToken0).toBe(100n);
        expect(creditsToken1).toBe(260n);

        creditsToken0 = testbed.getMapValuePerSlot(Context.Tokens[0], Context.SenderAccount2);
        creditsToken1 = testbed.getMapValuePerSlot(Context.Tokens[1], Context.SenderAccount2);
        expect(creditsToken0).toBe(0n);
        expect(creditsToken1).toBe(60n);
    })
})
