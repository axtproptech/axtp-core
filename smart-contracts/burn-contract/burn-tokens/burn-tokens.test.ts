import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {BurnTokens} from './burn-tokens.scenarios';


describe('Burn Contract - Burn Tokens', () => {
    test('should register burned tokens as expected', () => {
        const testbed = SimulatorTestbed
            .loadContract(Context.ContractPath)
            .runScenario(BurnTokens);
        let creditsToken0 = testbed.getMapValuePerSlot(Context.Tokens[0], Context.SenderAccount1);
        let creditsToken1 = testbed.getMapValuePerSlot(Context.Tokens[1], Context.SenderAccount1);
        let creditsToken2 = testbed.getMapValuePerSlot(Context.Tokens[2], Context.SenderAccount1);
        expect(creditsToken0).toBe(110n);
        expect(creditsToken1).toBe(220n);
        expect(creditsToken2).toBe(0n); // not tracked

        creditsToken0 = testbed.getMapValuePerSlot(Context.Tokens[0], Context.SenderAccount2);
        creditsToken1 = testbed.getMapValuePerSlot(Context.Tokens[1], Context.SenderAccount2);
        creditsToken2 = testbed.getMapValuePerSlot(Context.Tokens[2], Context.SenderAccount2);
        expect(creditsToken0).toBe(50n);
        expect(creditsToken1).toBe(60n);
        expect(creditsToken2).toBe(0n); // not tracked
    })
})
