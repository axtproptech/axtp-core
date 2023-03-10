import { Input } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { voidFn } from "@/app/voidFn";
import { HintBox } from "@/app/components/hintBox";

interface Props {
  account: string;
}

export const StepSeeNewAccount: FC<Props> = ({ account }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("your_account")}</h2>
      </section>
      <section>
        <HintBox text={t("your_account_hint")} />
      </section>
      <section className="relative mb-2">
        <Input
          className="w-full lg:w-[75%] text-center border-base-content"
          size="lg"
          value={account}
          onChange={voidFn}
          readOnly
        />
      </section>
      <section />
    </div>
  );
};
