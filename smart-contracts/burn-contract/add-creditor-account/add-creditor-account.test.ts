import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {AddCreditorAccounts, AddCreditorAccountsNotAllowed} from './add-creditor-account.scenarios';


describe('Burn Contract - Add Creditor Accounts', () => {
    test('should add creditor accounts as expected', () => {
        const testbed = new SimulatorTestbed(AddCreditorAccounts)
            .loadContract(Context.ContractPath)
            .runScenario();
        const map = testbed.getContractMapValues(Context.Maps.CreditorAccounts);
        expect(map).toEqual([
            {
                k1: Context.Maps.CreditorAccounts,
                k2: Context.CreditorAccount[0],
                value: 1n
            },
            {
                k1: Context.Maps.CreditorAccounts,
                k2: Context.CreditorAccount[1],
                value: 1n
            }
        ]);
    })
    test('should not to allow add as not creator', () => {
        const testbed = new SimulatorTestbed(AddCreditorAccountsNotAllowed)
            .loadContract(Context.ContractPath)
            .runScenario();
        const map = testbed.getContractMapValues(Context.Maps.CreditorAccounts);
        expect(map.length).toEqual(0);
    })
})
