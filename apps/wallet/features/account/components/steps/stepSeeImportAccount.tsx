import { Input } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { voidFn } from "@/app/voidFn";

interface Props {
  account: string;
}

export const StepSeeImportAccount: FC<Props> = ({ account }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("your_imported_account")}</h2>
      </section>
      <section className="relative mt-[15%] mb-2">
        <Input
          className="text-center border-base-content"
          size="lg"
          maxLength={7}
          value={account}
          onChange={voidFn}
          readOnly
        />
      </section>
      <section className="w-[75%] mx-auto">
        <div className="text-justify border border-base-content/50 px-4 py-2 rounded">
          <p className="bottom-10">{t("your_imported_account_hint")}</p>
        </div>
      </section>
    </div>
  );
};
