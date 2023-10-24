import { useRouter } from "next/router";
import { MouseEvent, useEffect } from "react";
import { AttentionSeeker } from "react-awesome-reveal";
import { useTranslation } from "next-i18next";
import { RiSurveyLine, RiUserReceivedLine } from "react-icons/ri";
import { Glasscard } from "@/app/components/cards/glasscard";

export const HomeKYC = () => {
  const { t } = useTranslation();
  const { prefetch, push } = useRouter();

  useEffect(() => {
    prefetch("/kyc/setup");
    prefetch("/account/import");
  }, []);

  const handleCardClick = (route: string) => async (_: MouseEvent) => {
    await push(`${route}`);
  };

  return (
    <div className="flex justify-center items-center h-[75vh]">
      <div className="flex flex-col justify-center max-w-sm gap-4">
        <Glasscard
          icon={
            <AttentionSeeker effect="tada" delay={500}>
              <RiUserReceivedLine size={32} />
            </AttentionSeeker>
          }
          title={t("log_in")}
          text={t("import_account_hint")}
          onClick={handleCardClick("/account/import")}
        />

        <p className="text-center mt-8">{t("are_you_new_here")}</p>

        <Glasscard
          icon={
            <AttentionSeeker effect="tada">
              <RiSurveyLine size={32} />
            </AttentionSeeker>
          }
          title={t("register_customer")}
          text={t("register_customer_hint")}
          onClick={handleCardClick("/kyc/setup")}
        />
      </div>
    </div>
  );
};
