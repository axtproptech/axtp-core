import { Http } from "@signumjs/http";
import { RewardItemData } from "@/types/rewardItemData";
import { withError } from "@axtp/core";

export class RewardService {
  constructor(private bffClient: Http) {}

  async fetchRewards(customerId: string) {
    return withError<RewardItemData[]>(async () => {
      const { response } = await this.bffClient.get(
        `/customer/${customerId}/rewards`
      );
      return response;
    });
  }
}
