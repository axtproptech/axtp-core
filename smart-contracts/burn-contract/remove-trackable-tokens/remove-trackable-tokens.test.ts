import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {RemoveTrackableTokens, RemoveTrackableTokensNotAllowed} from './remove-trackable-tokens.scenarios';


describe('Burn Contract - Remove Trackable Tokens', () => {
    test('should remove trackable tokens as expected', () => {
        const testbed = new SimulatorTestbed(RemoveTrackableTokens)
            .loadContract(Context.ContractPath)
            .runScenario();
        const map = testbed.getContractMapValues(Context.Maps.TrackableTokens);
        expect(map).toEqual([
            {
                k1: Context.Maps.TrackableTokens,
                k2: Context.Tokens[0],
                value: 0n
            },
            {
                k1: Context.Maps.TrackableTokens,
                k2: Context.Tokens[1],
                value: 0n
            },
            {
                k1: Context.Maps.TrackableTokens,
                k2: Context.Tokens[2],
                value: 0n
            }
        ]);
    })
    test('should not to allow remove as not creator', () => {
        const testbed = new SimulatorTestbed(RemoveTrackableTokensNotAllowed)
            .loadContract(Context.ContractPath)
            .runScenario();
        const map = testbed.getContractMapValues(Context.Maps.TrackableTokens);
        expect(map).toEqual([
            {
                k1: Context.Maps.TrackableTokens,
                k2: Context.Tokens[0],
                value: 1n
            },
            {
                k1: Context.Maps.TrackableTokens,
                k2: Context.Tokens[1],
                value: 1n
            }
        ]);

    })
})
