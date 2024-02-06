import { ServiceContext } from "./serviceContext";
import { withError } from "@axtp/core/common/withError";

export class AccountService {
  constructor(private context: ServiceContext) {}

  async getAccount(accountId: string) {
    return withError(async () => {
      const { ledger } = this.context;
      return ledger.account.getAccount({
        accountId,
      });
    });
  }
}
