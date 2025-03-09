import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { PinInput } from "@/app/components/pinInput";
import { Button } from "react-daisyui";
import {
  RiArrowLeftCircleLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiEdit2Line,
} from "react-icons/ri";
import { useNotification } from "@/app/hooks/useNotification";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { KeyError } from "@/types/keyError";
import { HttpError } from "@signumjs/http";
import { ErrorBox } from "@/app/components/hintBoxes/errorBox";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { AttentionSeeker, Fade } from "react-awesome-reveal";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";
import { StepProps } from "./stepProps";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { voidFn } from "@/app/voidFn";

enum SigningStatus {
  NotSigned,
  ProcessingSigning,
  SigningSuccess,
  SigningFailure,
}

export const StepSign = ({ formData, previousStep }: StepProps) => {
  const ref = useRef(null);
  const { t } = useTranslation();
  const router = useRouter();
  const { customer, getKeys } = useAccount();
  const { KycService, TrackingEventService } = useAppContext();
  const LedgerService = useLedgerService();
  const { showError } = useNotification();
  const [pin, setPin] = useState("");
  const [signingStatus, setSigningStatus] = useState(SigningStatus.NotSigned);
  const [error, setError] = useState("");
  const { mutate } = useSWRConfig();
  const { setNavItems } = useBottomNavigation();

  useEffect(() => {
    setNavItems([
      {
        label: t("back"),
        icon: <RiArrowLeftCircleLine />,
        back: false,
        onClick: previousStep,
      },
      {
        route: "/",
        label: t("cancel"),
        icon: <RiCloseCircleLine />,
      },
      {
        label: "",
        disabled: true,
        hideLabel: true,
        onClick: voidFn,
        icon: <></>,
      },
    ]);
  }, []);

  const sign = async () => {
    if (!LedgerService || !customer) return;

    if (!formData.document) {
      showError(t("kyc-sign-error-not-read"));
      return;
    }

    try {
      const { documentHash, url, type } = formData.document;
      TrackingEventService.track({
        msg: "Signing Terms",
        detail: {
          cuid: customer.customerId,
          url,
          documentHash,
          type,
        },
      });
      setSigningStatus(SigningStatus.ProcessingSigning);
      const keys = await getKeys(pin);
      const { transaction } = await LedgerService.termsSigner.sign({
        cuid: customer.customerId,
        documentHash,
        type,
        senderKeys: keys,
      });

      const { poolId, redirect } = formData.queryParams!;
      await KycService.storeSignedDocument({
        documentHash,
        type,
        poolId,
        url,
        expires: true,
        transactionId: transaction,
        customerId: customer?.customerId,
      });
      // TODO: add attachment
      await KycService.sendTermsOfRiskSignedConfirmationMail(
        customer?.customerId,
        transaction
      );
      await mutate(`/fetchCustomer/${customer.customerId}`);
      setSigningStatus(SigningStatus.SigningSuccess);
      setTimeout(() => router.replace(redirect), 2_000);
    } catch (e: any) {
      setSigningStatus(SigningStatus.SigningFailure);
      if (e instanceof KeyError) {
        showError(t("wrong_pin"));
      } else if (e instanceof HttpError) {
        setError(t("kyc-sign-error-signing-failed", { error: e.message }));
      }
    } finally {
      // @ts-ignore
      ref.current?.reset();
    }
  };

  return (
    <Fade className="opacity-0">
      <div className="flex flex-col w-full">
        <section>
          <h3>{t("sign_terms")}</h3>
        </section>
        <section>
          {signingStatus === SigningStatus.NotSigned && document && (
            <>
              <p>
                {t("kyc-sign-hereby-declare", { name: customer?.firstName })}
              </p>
              <div className="flex flex-col justify-center gap-2">
                <PinInput onPinChange={setPin} ref={ref} />
                <div className={"mt-4"}>
                  <Button
                    color="secondary"
                    onClick={sign}
                    startIcon={<RiEdit2Line />}
                  >
                    {t("sign")}
                  </Button>
                </div>
              </div>
            </>
          )}

          {signingStatus === SigningStatus.ProcessingSigning && (
            <HintBox>
              <AttentionSeeker
                effect="tada"
                className="text-center w-[128px] mx-auto"
              >
                <AnimatedIconContract loopDelay={1_000} />
              </AttentionSeeker>
              <div className="text-center">
                <h3 className="my-1">{t("kyc-sign-signing-progress-title")}</h3>
                <small>{t("kyc-sign-signing-progress")}</small>
              </div>
            </HintBox>
          )}

          {signingStatus === SigningStatus.SigningSuccess && (
            <HintBox>
              <AttentionSeeker effect="tada" className="text-center">
                <RiCheckboxCircleLine
                  size={92}
                  className="w-full"
                  color="success"
                />
              </AttentionSeeker>
              <div className="prosa text-center">
                <h3 className="my-1">{t("kyc-sign-signing-success-title")}</h3>
                <p>{t("kyc-sign-signing-success")}</p>
              </div>
            </HintBox>
          )}

          {signingStatus === SigningStatus.SigningFailure && (
            <>
              <ErrorBox
                title={t("kyc-sign-error-signing-failed")}
                text={error}
              />
              <Button
                color="primary"
                className="mt-2"
                onClick={() => setSigningStatus(SigningStatus.NotSigned)}
              >
                {t("try_again")}
              </Button>
            </>
          )}
        </section>
      </div>
    </Fade>
  );
};
