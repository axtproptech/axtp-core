import { Wallet, SendEncryptedMessageArgs } from "@signumjs/wallets";

export class WalletDecorator {
  constructor(private wallet: Wallet) {}

  async confirm(unsignedTransaction: string) {
    try {
      window.dispatchEvent(new Event("wallet-sign-start"));
      return await this.wallet.confirm(unsignedTransaction);
    } catch (e: any) {
      throw e;
    } finally {
      window.dispatchEvent(new Event("wallet-sign-end"));
    }
  }

  async sendEncrypted(args: SendEncryptedMessageArgs) {
    try {
      window.dispatchEvent(new Event("wallet-sign-start"));
      return await this.wallet.sendEncryptedMessage(args);
    } catch (e: any) {
      throw e;
    } finally {
      window.dispatchEvent(new Event("wallet-sign-end"));
    }
  }
}
