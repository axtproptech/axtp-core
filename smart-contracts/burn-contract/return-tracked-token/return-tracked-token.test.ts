import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {
    ReturnTrackedTokens,
    ReturnTrackedTokensEvenWhenUntracked,
    ReturnTrackedTokensEvenWithZeroBalance,
    ReturnTrackedTokensNotAllowed
} from './return-tracked-token.scenarios';


describe('Burn Contract - Return Tracked Tokens', () => {
    test('should return tokens as expected', () => {
        const testbed = new SimulatorTestbed(ReturnTrackedTokens)
            .loadContract(Context.ContractPath)
            .runScenario();

        const contractAccount = testbed.getAccount(Context.ThisContract);
        expect(contractAccount?.tokens).toEqual([
                {asset: Context.Tokens[0], quantity: 20n},
                {asset: Context.Tokens[1], quantity: 70n},
                {asset: Context.Tokens[2], quantity: 1000n},
            ],
        )

        const sender1Account = testbed.getAccount(Context.SenderAccount1);
        expect(sender1Account?.tokens).toEqual([
                {asset: Context.Tokens[0], quantity: 10n},
                {asset: Context.Tokens[1], quantity: 80n},
                {asset: Context.Tokens[2], quantity: 0n},
            ],
        )

        const sender2Account = testbed.getAccount(Context.SenderAccount2);
        expect(sender2Account?.tokens).toEqual([
                {asset: Context.Tokens[0], quantity: 0n},
                {asset: Context.Tokens[1], quantity: 150n},
                {asset: Context.Tokens[2], quantity: 2000n},
            ],
        )

        let creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount1);
        let creditsToken1 = testbed.getContractMapValue(Context.Tokens[1], Context.SenderAccount1);
        let creditsToken2 = testbed.getContractMapValue(Context.Tokens[2], Context.SenderAccount1);

        expect(creditsToken0).toBe(0n);
        expect(creditsToken1).toBe(20n);
        expect(creditsToken2).toBe(1000n);

        creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount2);
        creditsToken1 = testbed.getContractMapValue(Context.Tokens[1], Context.SenderAccount2);
        creditsToken2 = testbed.getContractMapValue(Context.Tokens[2], Context.SenderAccount2);
        expect(creditsToken0).toBe(20n);
        expect(creditsToken1).toBe(50n);
        expect(creditsToken2).toBe(0n);
    })

    test('should credit tracked tokens as expected - even when tracking removed', () => {
        const testbed = new SimulatorTestbed(ReturnTrackedTokensEvenWhenUntracked)
            .loadContract(Context.ContractPath)
            .runScenario();
        const creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount1);
        expect(creditsToken0).toBe(3n);
        const sender1Account = testbed.getAccount(Context.SenderAccount1);
        expect(sender1Account?.tokens).toEqual([
                {asset: Context.Tokens[0], quantity: 7n},
                {asset: Context.Tokens[1], quantity: 0n},
                {asset: Context.Tokens[2], quantity: 0n},
            ],
        )
    })

    // ### TODO:

    test('should credit tracked tokens as expected - even when no balance', () => {
        const testbed = new SimulatorTestbed(ReturnTrackedTokensEvenWithZeroBalance)
            .loadContract(Context.ContractPath)
            .runScenario();
        let creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount1);
        expect(creditsToken0).toBe(0n);
    })

    test('should not credit tracked tokens as account is not allowed', () => {
        const testbed = new SimulatorTestbed(ReturnTrackedTokensNotAllowed)
            .loadContract(Context.ContractPath)
            .runScenario();
        let creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount1);
        expect(creditsToken0).toBe(10n);
    })
})
