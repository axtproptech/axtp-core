import { FC, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useAppDispatch } from "@/states/hooks";
import { accountActions } from "@/app/states/accountState";
import { CustomerSafeData } from "@/types/customerSafeData";
import { useAppContext } from "@/app/hooks/useAppContext";
import { Address } from "@signumjs/core";
import { Slide, Zoom } from "react-awesome-reveal";

interface Props {
  customer: CustomerSafeData;
}

export const RegisterSuccess: FC<Props> = ({ customer }) => {
  const { t } = useTranslation();
  const { firstName, publicKey } = customer;
  const dispatch = useAppDispatch();
  const { ActivationService } = useAppContext();

  useEffect(() => {
    if (!customer) return;
    if (customer.publicKey) {
      // fire and forget!
      ActivationService.activate(customer.publicKey);
    }
    dispatch(accountActions.setCustomer(customer));
  }, [dispatch, customer, ActivationService]);

  return (
    <div className="flex flex-col text-center h-[80vh] justify-center items-center relative prose w-full mx-auto">
      <Zoom triggerOnce>
        <section>
          <div className="overflow-hidden gap-2 relative py-8 rounded-xl flex flex-col items-center">
            <div
              className="w-full h-full absolute top-0 left-0 m-0 p-0 z-0"
              style={{
                background:
                  " linear-gradient(rgba(0,0,0,0.40), rgba(0,0,0,0.60)),url(/assets/img/cardGradientBackground.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "bottom",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full absolute top-0 left-0 m-0 p-0 z-10 glance-effect"
                src="/assets/img/card-grid.webp"
                alt="Card grid"
              />
            </div>

            <div
              className="flex flex-row items-start justify-start gap-x-4 px-4 drop-shadow w-full h-16"
              style={{ width: "calc(100vw - 48px)", maxWidth: "400px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/axt-logo-only.svg"
                className="w-[64px] top-[-32px] z-10 relative"
                alt="AXT Logo"
              />
              <span className="text-zinc-300 text-xl font-bold z-10">
                {t("axt_club_member")}
              </span>
            </div>
            <div className="flex flex-col items-start justify-center z-10 text-zinc-200 font-mono">
              <span>{firstName}</span>
              <span>
                {Address.fromPublicKey(publicKey).getReedSolomonAddress(false)}
              </span>
            </div>
          </div>
        </section>
      </Zoom>

      <Slide triggerOnce direction="up">
        <section className="px-4">
          <h2>{t("register_welcome", { firstName })}</h2>
          <p className="text-justify">{t("register_description")}</p>
        </section>
      </Slide>
    </div>
  );
};
