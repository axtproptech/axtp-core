import { Glasscard } from "@/app/components/cards/glasscard";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { RiUserAddLine, RiUserReceivedLine } from "react-icons/ri";
import { AttentionSeeker } from "react-awesome-reveal";
import { useTranslation } from "next-i18next";

export const AccountSetup = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const handleCardClick = (route: string) => async (_: MouseEvent) => {
    await router.push(`/account/${route}`);
  };

  return (
    <div className="flex justify-center items-center h-[75vh]">
      <div className="flex flex-col md:flex-row">
        <Glasscard
          className="w-80"
          icon={
            <AttentionSeeker effect="tada">
              <RiUserReceivedLine size={32} />
            </AttentionSeeker>
          }
          title={t("import_account")}
          text={t("import_account_hint")}
          onClick={handleCardClick("import")}
        />
        <Glasscard
          className="mt-8 md:mt-0 md:ml-8 w-80"
          icon={
            <AttentionSeeker effect="tada" delay={500}>
              <RiUserAddLine size={32} />
            </AttentionSeeker>
          }
          title={t("create_account")}
          text={t("create_account_hint")}
          onClick={handleCardClick("new")}
        />
      </div>
    </div>
  );
};
