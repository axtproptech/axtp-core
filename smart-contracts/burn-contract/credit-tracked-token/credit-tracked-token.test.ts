import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {
    CreditTrackedTokens,
    CreditTrackedTokensEvenWhenUntracked,
    CreditTrackedTokensEvenWithZeroBalance, CreditTrackedTokensNotAllowed
} from './credit-tracked-token.scenarios';


describe('Burn Contract - Credit Tracked Tokens', () => {
    test('should credit tokens as expected', () => {
        const testbed = new SimulatorTestbed()
            .loadContract(Context.ContractPath)
            .runScenario(CreditTrackedTokens);


        const contractAccount = testbed.getAccount(Context.ThisContract);
        expect(contractAccount?.tokens).toEqual([
                {asset: Context.Tokens[0], quantity: 30n},
                {asset: Context.Tokens[1], quantity: 300n},
                {asset: Context.Tokens[2], quantity: 3000n},
            ],
        )

        let creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount1);
        let creditsToken1 = testbed.getContractMapValue(Context.Tokens[1], Context.SenderAccount1);
        let creditsToken2 = testbed.getContractMapValue(Context.Tokens[2], Context.SenderAccount1);

        expect(creditsToken0).toBe(5n);
        expect(creditsToken1).toBe(90n);
        expect(creditsToken2).toBe(1000n);

        creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount2);
        creditsToken1 = testbed.getContractMapValue(Context.Tokens[1], Context.SenderAccount2);
        creditsToken2 = testbed.getContractMapValue(Context.Tokens[2], Context.SenderAccount2);
        expect(creditsToken0).toBe(20n);
        expect(creditsToken1).toBe(0n);
        expect(creditsToken2).toBe(1800n);
    })

    test('should credit tracked tokens as expected - even when tracking removed', () => {
        const testbed = new SimulatorTestbed(CreditTrackedTokensEvenWhenUntracked)
            .loadContract(Context.ContractPath)
            .runScenario();
        let creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount1);
        expect(creditsToken0).toBe(3n);
    })

    test('should credit tracked tokens as expected - even when no balance', () => {
        const testbed = new SimulatorTestbed(CreditTrackedTokensEvenWithZeroBalance)
            .loadContract(Context.ContractPath)
            .runScenario();
        let creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount1);
        expect(creditsToken0).toBe(0n);
    })

    test('should not credit tracked tokens as account is not allowed', () => {
        const testbed = new SimulatorTestbed(CreditTrackedTokensNotAllowed)
            .loadContract(Context.ContractPath)
            .runScenario();
        let creditsToken0 = testbed.getContractMapValue(Context.Tokens[0], Context.SenderAccount1);
        expect(creditsToken0).toBe(10n);
    })
})
