import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {RemoveCreditorAccounts, RemoveCreditorAccontsNotAllowed} from './remove-creditor-account.scenarios';


describe('Burn Contract - Remove Creditor Accounts', () => {
    test('should remove creditor accounts as expected', () => {
        const testbed = SimulatorTestbed
            .loadContract(Context.ContractPath)
            .runScenario(RemoveCreditorAccounts);
        const map = testbed.getMapValuesPerSlot(Context.Maps.CreditorAccounts);
        expect(map).toEqual([
            {
                k1: Context.Maps.CreditorAccounts,
                k2: Context.CreditorAccount[0],
                value: 0n
            },
            {
                k1: Context.Maps.CreditorAccounts,
                k2: Context.CreditorAccount[1],
                value: 0n
            },
        ]);
    })
    test('should not to allow remove as not creator', () => {
        const testbed = SimulatorTestbed
            .loadContract(Context.ContractPath)
            .runScenario(RemoveCreditorAccontsNotAllowed);
        const map = testbed.getMapValuesPerSlot(Context.Maps.CreditorAccounts);
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
            },
        ]);

    })
})
