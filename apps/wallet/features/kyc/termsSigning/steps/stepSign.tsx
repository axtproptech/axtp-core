import { useRef, useState } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { PinInput } from "@/app/components/pinInput";
import { Button, Checkbox } from "react-daisyui";
import { RiCheckboxCircleLine, RiEdit2Line } from "react-icons/ri";
import { useNotification } from "@/app/hooks/useNotification";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { KeyError } from "@/types/keyError";
import { HttpError } from "@signumjs/http";
import { SignableDocument } from "../../types/signableDocument";
import { ErrorBox } from "@/app/components/hintBoxes/errorBox";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { AttentionSeeker } from "react-awesome-reveal";
import * as React from "react";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";

enum SigningStatus {
  NotSigned,
  ProcessingSigning,
  SigningSuccess,
  SigningFailure,
}

interface Props {
  redirectUrl: string;
  document: SignableDocument | null;
  poolId?: string;
}

export const StepSign = ({ redirectUrl, document, poolId }: Props) => {
  const ref = useRef(null);
  const { t } = useTranslation();
  const router = useRouter();
  const { customer, getKeys } = useAccount();
  const { KycService } = useAppContext();
  const ledgerService = useLedgerService();
  const { showError } = useNotification();
  const [pin, setPin] = useState("");
  const [signingStatus, setSigningStatus] = useState(SigningStatus.NotSigned);
  const [error, setError] = useState("");
  const { mutate } = useSWRConfig();

  const sign = async () => {
    if (!ledgerService || !customer) return;

    if (!document) {
      showError(t("kyc-sign-error-not-read"));
      return;
    }

    try {
      setSigningStatus(SigningStatus.ProcessingSigning);
      const keys = await getKeys(pin);
      const { documentHash, url, type } = document;
      const { transaction } = await ledgerService.termsSigner.sign({
        documentHash,
        type,
        senderKeys: keys,
      });

      await KycService.storeSignedDocument({
        documentHash,
        type,
        poolId,
        url,
        expires: true,
        transactionId: transaction,
        customerId: customer?.customerId,
      });
      await mutate(`/fetchCustomer/${customer.customerId}`);
      setSigningStatus(SigningStatus.SigningSuccess);

      setTimeout(() => router.replace(redirectUrl), 2_000);
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
    <div className="flex flex-col w-full">
      <section>
        <h3>Sign Terms</h3>
      </section>
      <section>
        {signingStatus === SigningStatus.NotSigned && document && (
          <>
            <p>{t("kyc-sign-hereby-declare", { name: customer?.firstName })}</p>
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
            <ErrorBox title={t("kyc-sign-error-signing-failed")} text={error} />
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
  );
};
