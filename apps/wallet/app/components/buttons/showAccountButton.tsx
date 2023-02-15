import { Button } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const ShowAccountButton = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleOnJoinClick = async () => {
    await router.push("/account");
  };

  return (
    <div className="animate-wiggle">
      <Button color="accent" size="lg" onClick={handleOnJoinClick}>
        {t("my_portfolio")}
      </Button>
    </div>
  );
};
