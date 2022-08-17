import { AnimatedIconStockShare } from "@/app/components/animatedIcons/animatedIconStockShare";
import { useTranslation } from "next-i18next";
import { useNotification } from "@/app/hooks/useNotification";
import { useEffect } from "react";
import { decrypt, stretchKey, encrypt, StretchedKey } from "@/app/sec";

export const Home = () => {
  const { t } = useTranslation();
  const { showSuccess } = useNotification();

  useEffect(() => {
    let k: StretchedKey;

    stretchKey("MySecret")
      .then((key) => {
        k = key;
        console.log("Key", key);
        return encrypt(key.key, "some funnny message");
      })
      .then((cipher) => {
        console.log("Cipher", cipher);
        return decrypt(k.key, cipher);
      })
      .then((decrypted) => {
        console.log("result", decrypted);
      });
  }, []);

  return (
    <div className="my-5">
      <div className="w-[240px] mx-auto">
        <AnimatedIconStockShare loopDelay={5000} touchable />
      </div>
      <div className="prose">
        <h1>{t("good_things")}</h1>
      </div>
    </div>
  );
};
