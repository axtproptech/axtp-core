import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { Divider, Input } from "react-daisyui";
import { useFormContext } from "react-hook-form";
import { Address } from "@signumjs/core";
import { useAppContext } from "@/app/hooks/useAppContext";
import { generateMasterKeys, PassPhraseGenerator } from "@signumjs/crypto";
import { voidFn } from "@/app/voidFn";
import { PinInput } from "@/app/components/pinInput";
import { AnimatedIconCoins } from "@/app/components/animatedIcons/animatedIconCoins";
import { KycFormData } from "./kycFormData";
import { StepLayout } from "../../components/StepLayout";

export const BlockchainAccountSetup = () => {
  const { t } = useTranslation();
  const { Ledger } = useAppContext();
  const { watch, setValue } = useFormContext<KycFormData>();

  const devicePin = watch("devicePin");
  const accountPublicKey = watch("accountPublicKey");

  const generateSeed = async () => {
    const arr = new Uint8Array(128);
    crypto.getRandomValues(arr);
    const generator = new PassPhraseGenerator();
    const words = await generator.generatePassPhrase(Array.from(arr));

    return words.join(" ");
  };

  const handlePinChange = (value: string) => {
    setValue("devicePin", value);
  };

  const isWeak = !!devicePin.startsWith("12345");

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
    <StepLayout>
      <section>
        <h2>{t("creation_of_blockchain_account")}</h2>
        <div className="text-justify">{t("your_account_hint")}</div>
      </section>

      <section className="relative flex flex-col justify-center items-center gap-4 mt-10">
        <div className="absolute left-[4px] top-[-40px] w-[64px] bg-base-100">
          <AnimatedIconCoins loopDelay={500} />
        </div>
        <Input
          className="w-full text-center border-base-content font-bold"
          size="lg"
          value={accountRS}
          onChange={voidFn}
          readOnly
        />
      </section>

      <Divider />

      <section>
        <h2>{t("define_pin")}</h2>
        <div className="text-justify">{t("define_pin_hint")}</div>

        <section className="relative flex flex-col justify-center items-center gap-4 mt-10">
          <PinInput onPinChange={handlePinChange} />
          {isWeak && (
            <small className="text-error mt-2">{t("pin_weak_pin")}</small>
          )}
        </section>
      </section>

      <section />
    </StepLayout>
  );
};
