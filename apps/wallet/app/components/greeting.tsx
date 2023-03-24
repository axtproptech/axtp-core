import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";

function getDayTime() {
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 4 && hours < 12) {
    return "morning";
  }

  if (hours >= 12 && hours < 18) {
    return "afternoon";
  }

  if (hours >= 18 && hours < 22) {
    return "evening";
  }

  if (hours >= 22) {
    return "night";
  }
}

export const Greeting = () => {
  const { t } = useTranslation();
  const { customer } = useAccount();

  if (!customer) return null;

  const dayTime = getDayTime();

  return (
    <div>
      <p className="text-lg font-bold my-1">
        {t(`good_${dayTime}`, { name: customer.firstName })}
      </p>
    </div>
  );
};
