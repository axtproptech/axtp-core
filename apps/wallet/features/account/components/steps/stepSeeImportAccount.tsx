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
    <div className="flex flex-col justify-center content-center text-center h-[90vh] relative prose max-w-none w-full">
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
      <section className="w-[75%] m-auto top-8">
        <div className="text-justify border border-base-content/50 px-4 py-2 rounded">
          <p className="bottom-10">{t("your_imported_account_hint")}</p>
        </div>
      </section>
    </div>
  );
};
