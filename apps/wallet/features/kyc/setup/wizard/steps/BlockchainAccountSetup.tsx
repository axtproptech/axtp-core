import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { Input } from "react-daisyui";
import { useFormContext } from "react-hook-form";
import { Address } from "@signumjs/core";
import { useAppContext } from "@/app/hooks/useAppContext";
import { generateMasterKeys, PassPhraseGenerator } from "@signumjs/crypto";
import { AttentionSeeker } from "react-awesome-reveal";
import { voidFn } from "@/app/voidFn";
import { AnimatedIconCoins } from "@/app/components/animatedIcons/animatedIconCoins";
import { KycWizard } from "../validation/types";

export const BlockchainAccountSetup = () => {
  const { t } = useTranslation();
  const { Ledger } = useAppContext();
  const { watch, setValue } = useFormContext<KycWizard>();

  const accountPublicKey = watch("accountPublicKey");

  const generateSeed = async () => {
    const arr = new Uint8Array(128);
    crypto.getRandomValues(arr);
    const generator = new PassPhraseGenerator();
    const words = await generator.generatePassPhrase(Array.from(arr));

    return words.join(" ");
  };

  const pickRandomKeyIndex = () => {
    const min = 1;
    const max = 12;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const setupAccount = async () => {
    const accountSeedphrase = await generateSeed().then((seed) => seed);

    const randomKey = pickRandomKeyIndex();

    const keys = generateMasterKeys(accountSeedphrase);
    const { publicKey } = keys;

    setValue("accountPublicKey", publicKey);
    setValue("accountSeedPhrase", accountSeedphrase);
    setValue("seedPhraseVerificationIndex", randomKey);
  };

  const accountRS = accountPublicKey
    ? Address.fromPublicKey(
        accountPublicKey,
        Ledger.AddressPrefix
      ).getReedSolomonAddress()
    : "";

  // This is NOT STORED ON REDUX, THIS IS ONLY TEMPORALY STORED ON VOLATILE DATA (a.k.a React Hook Form States)
  useEffect(() => {
    setupAccount();
  }, []);

  return (
    <div className="flex flex-col justify-center text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto">
      <section>
        <h2>{t("creation_of_blockchain_account")}</h2>
      </section>

      <section className="flex flex-col justify-center items-center gap-4">
        <div className="w-40 h-32">
          <AttentionSeeker effect="heartBeat">
            <AnimatedIconCoins loopDelay={500} />
          </AttentionSeeker>
        </div>

        <span className="text-white text-center font-bold">
          {t("your_account_hint")}
        </span>

        <Input
          className="w-full text-center border-base-content font-bold"
          size="lg"
          value={accountRS}
          onChange={voidFn}
          readOnly
        />
      </section>

      <section />
    </div>
  );
};
