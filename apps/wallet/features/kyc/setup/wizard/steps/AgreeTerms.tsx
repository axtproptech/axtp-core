import { useTranslation } from "next-i18next";
import { Form, Checkbox } from "react-daisyui";
import { useFormContext, Controller } from "react-hook-form";
import { KycWizard } from "../validation/types";

import Link from "next/link";

export const AgreeTerms = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<KycWizard>();

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto px-4">
      <section>
        <h3>{t("sign_up_for_axt")}</h3>
        <p className="text-white text-justify font-bold">
          {t("agree_terms_hint")}
        </p>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <Controller
          name="agreeTerms"
          control={control}
          render={({ field }) => (
            <div className="shadow bg-base-200 w-64 rounded-lg p-4">
              <Form.Label title={t("accept")}>
                {/* @ts-ignore */}
                <Checkbox {...field} size="lg" />
              </Form.Label>
            </div>
          )}
        />

        <span className="text-white text-center">
          {t("agree_terms_label")}
          <br />
          <Link href="/terms/usage" passHref>
            <a className="px-1" target="_blank">
              {t("terms_of_use")}
            </a>
          </Link>{" "}
          <span>{t("and")}</span>
          <Link href="/terms/privacy" passHref>
            <a className="pl-2 pr-1" target="_blank">
              {t("privacy_policy")}
            </a>
          </Link>
          <br />
          {t("agree_terms_label_second_part")}
        </span>
      </section>

      <section />
    </div>
  );
};
