import { Button } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { RiWallet3Line } from "react-icons/ri";

export const ShowAccountButton = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleOnJoinClick = async () => {
    await router.push("/account");
  };

  return (
    <div className="animate-wiggle">
      <Button color="accent" size="lg" onClick={handleOnJoinClick}>
        <RiWallet3Line className="mr-2" size="28" />
        {t("my_portfolio")}
      </Button>
    </div>
  );
};
