import { FC, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useAppDispatch } from "@/states/hooks";
import { accountActions } from "@/app/states/accountState";
import { CustomerSafeData } from "@/types/customerSafeData";

interface Props {
  customer: CustomerSafeData;
}

export const RegisterSuccess: FC<Props> = ({ customer }) => {
  const { t } = useTranslation();
  const { firstName } = customer;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!customer) return;

    dispatch(accountActions.setCustomer(customer));
  }, [dispatch, customer]);

  return (
    <div className="flex flex-col text-center h-[80vh] justify-center items-center relative prose w-full mx-auto">
      <section>
        <div className="overflow-hidden flex flex-col justify-center items-center gap-2 relative w-[300px] h-[150px] rounded-xl mx-auto">
          <div
            className="w-full h-full absolute top-0 left-0 m-0 p-0 z-0"
            style={{
              background:
                " linear-gradient(rgba(0,0,0,0.60), rgba(0,0,0,0.60)),url(/assets/img/cardGradientBackground.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "bottom",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full absolute top-0 left-0 m-0 p-0 z-10"
              src="/assets/img/card-grid.webp"
              alt="Card grid"
            />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/axt-text-logo-2.svg"
            className="w-1/2 z-10 m-0"
            alt="AXT Logo"
          />

          <span className="text-zinc-300 text-center font-bold z-10">
            {t("axt_club_member")}
          </span>
        </div>
      </section>

      <section className="px-4">
        <h3>{t("register_welcome", { firstName })}</h3>
        <p className="text-white text-justify font-bold">
          {t("register_description")}
        </p>
      </section>
    </div>
  );
};
