import {ServiceContext} from "@/app/services/serviceContext";
import {withError} from "@axtp/core";
import {TransactionId} from "@signumjs/core";
import {Keys} from "@signumjs/crypto";
import {Amount} from "@signumjs/util";

interface SignArgs {
    senderKeys: Keys,
    termsType: string,
    documentHash: string,
}

export class TermsSigningService {
    constructor(private context: ServiceContext) {}

    ## TODO

    async sign(args : SignArgs){
        return withError( () => {
            const {publicKey, signPrivateKey, agreementPrivateKey} = args.senderKeys;
            return this.context.ledger.message.sendEncryptedMessage({
               senderPublicKey: publicKey,
                senderAgreementKey: agreementPrivateKey,
                senderPrivateKey: signPrivateKey,
                feePlanck: Amount.fromSigna(0.02).getPlanck(),
                recipientId: "",
                recipientPublicKey: "",
                message: ""
            }) as Promise<TransactionId>;
        })
    }
}