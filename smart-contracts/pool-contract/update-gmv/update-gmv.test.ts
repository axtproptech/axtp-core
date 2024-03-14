import {expect, test, describe} from 'vitest'
import {SimulatorTestbed} from 'signum-smartc-testbed';
import {Context} from '../context';
import {UpdateGMV, UpdateGMVNotAuthorized} from "./update-gmv.scenarios";


describe('Pool Contract - Update GMV', () => {
    test('should update GMV', () => {
        const testbed = new SimulatorTestbed(UpdateGMV)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        expect(testbed.getContractMemoryValue("grossMarketValueAXTC")).toBe(100n);

        testbed.sendTransactionAndGetResponse([
            {
                blockheight: 3,
                amount: Context.ActivationFee,
                sender: Context.ApproverAccount[0],
                messageArr: [Context.Methods.UpdateGrossMarketValue, 200n],
                recipient: Context.ThisContract,
            },
        ])

        expect(testbed.getContractMemoryValue("grossMarketValueAXTC")).toBe(200n);
    })

    test('should not update GMV due to missing permission', () => {
        const testbed = new SimulatorTestbed(UpdateGMVNotAuthorized)
            .loadContract(Context.ContractPath, {
                poolName: "AXTP0001",
                poolRate: 5000_00,
                poolTokenQuantity: 100,
            })
            .runScenario();

        expect(testbed.getContractMemoryValue("grossMarketValueAXTC")).toBe( 5000_0000n);
    })

})
