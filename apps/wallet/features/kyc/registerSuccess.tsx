import { ChangeEvent, FC, useState } from "react";
import { CustomerData } from "@/types/customerData";
import { HintBox } from "@/app/components/hintBox";
import { useTranslation } from "next-i18next";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";
import Link from "next/link";
import { Checkbox } from "react-daisyui";

interface Props {
  customer: CustomerData;
}

export const RegisterSuccess: FC<Props> = ({ customer }) => {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);

  const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
    // do a post to
    console.log("Terms accepeted", e.target.checked);

    setAccepted(e.target.checked);
  };

  const { firstName } = customer;

  return (
    <div className="flex flex-col text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <div className="w-[240px] mx-auto">
          <AnimatedIconContract loopDelay={7500} touchable />
        </div>
      </section>
      <section className="prose">
        <h2>{t("register_welcome", { firstName })}</h2>
        <HintBox text={t("register_description")}>
          <div className="flex flex-row items-center justify-center mt-8">
            <Checkbox
              className="mr-2"
              color={"primary"}
              checked={accepted}
              onChange={handleChecked}
            />
            <div>
              <span className="mt-2 mr-1">{t("accept_terms")}</span>
              <Link href="/#">{t("terms_of_use")}</Link>
            </div>
          </div>
        </HintBox>
        <div className="mt-2">
          <Link href="/#">{t("privacy_policy")}</Link>
        </div>
      </section>
      <section></section>
    </div>
  );
};
