import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {AddTrackableTokens, AddTrackableTokensNotAllowed} from './add-trackable-tokens.scenarios';


describe('Burn Contract - Add Trackable Tokens', () => {
    test('should add trackable tokens as expected', () => {
        const testbed = new SimulatorTestbed(AddTrackableTokens)
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
    test('should not to allow add as not creator', () => {
        const testbed = new SimulatorTestbed(AddTrackableTokensNotAllowed)
            .loadContract(Context.ContractPath)
            .runScenario();
        const map = testbed.getContractMapValues(Context.Maps.TrackableTokens);
        expect(map.length).toEqual(0);
    })
})
