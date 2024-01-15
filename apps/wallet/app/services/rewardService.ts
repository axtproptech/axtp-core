import { withError } from "./withError";
import { Http } from "@signumjs/http";

export class RewardService {
  constructor(private bffClient: Http) {}

  async fetchRewards(customerId: string) {
    return withError<any>(async () => {
      const { response } = await this.bffClient.get(
        `/customer/${customerId}/rewards`
      );
      console.log(response);
      // const alias = await ledger.alias.getAliasById(aliasId);
      return Promise.resolve([]);
    });
  }
}
