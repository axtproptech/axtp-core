import { useTranslation } from "next-i18next";
import { Form, Checkbox } from "react-daisyui";
import { useFormContext, Controller } from "react-hook-form";
import { KycWizard } from "../validation/types";

import Link from "next/link";
import { useAppSelector } from "@/states/hooks";
import { selectInitialSetupStep } from "@/features/kyc/state";

interface Props {
  firstName: string;
}

export const AgreeTerms = ({ firstName }: Props) => {
  const { t } = useTranslation();
  const initialUserData = useAppSelector(selectInitialSetupStep);
  const { control } = useFormContext<KycWizard>();

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto px-4">
      <section>
        <h3>{t("sign_up_for_axt")}</h3>
        <p className="text-justify">
          {t("agree_terms_hint", { firstName: initialUserData.firstName })}
        </p>
        <div className="text-justify">
          {t("agree_terms_label")}
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
          {t("agree_terms_label_second_part")}
        </div>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <Controller
          name="agreeTerms"
          control={control}
          render={({ field }) => (
            <div className="shadow bg-base-200 w-xl rounded-lg p-4">
              <Form.Label
                title={t("accept_terms")}
                className="text-left font-bold"
              >
                {/* @ts-ignore */}
                <Checkbox {...field} size="lg" />
              </Form.Label>
            </div>
          )}
        />
      </section>

      <section />
    </div>
  );
};
