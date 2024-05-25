import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/hooks/useAppContext";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "next-i18next";
import { useAccount } from "@/app/hooks/useAccount";
import { PinInput } from "@/app/components/pinInput";
import { Button } from "react-daisyui";
import { RiEdit2Line, RiMailOpenLine } from "react-icons/ri";
import { useNotification } from "@/app/hooks/useNotification";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { KeyError } from "@/types/keyError";
import { HttpError } from "@signumjs/http";
import { SignableDocument } from "../../types/signableDocument";
import { LoadingBox } from "@/app/components/hintBoxes/loadingBox";
import { ErrorBox } from "@/app/components/hintBoxes/errorBox";

interface Props {
  onSigned: () => void;
  document: SignableDocument | null;
  poolId?: string;
}

export const StepSign = ({ onSigned, document, poolId }: Props) => {
  const ref = useRef(null);
  const { t } = useTranslation();
  const { customer, getKeys } = useAccount();
  const { KycService } = useAppContext();
  const ledgerService = useLedgerService();
  const { showError } = useNotification();
  const [pin, setPin] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState("");
  const sign = async () => {
    if (!ledgerService || !customer) return;

    if (!document || !document.hasRead) {
      // TODO: translation
      showError("Looks like you haven't read the document yet");
      return;
    }

    try {
      setIsSigning(true);
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

      onSigned();
    } catch (e: any) {
      if (e instanceof KeyError) {
        showError("Invalid Pin");
      } else if (e instanceof HttpError) {
        showError(`Signing Failed: ${e.message}`);
      }
    } finally {
      // @ts-ignore
      ref.current?.reset();
      setIsSigning(false);
    }
  };

  return (
    <div className="flex flex-col">
      <section>
        <h3>Sign Terms</h3>
      </section>

      {document && document.hasRead ? (
        <section>
          <p>
            I, {customer?.firstName}, hereby declare that I have carefully read
            and understood the document presented to me.
          </p>
          <div className="flex flex-col justify-center gap-2">
            <PinInput onPinChange={setPin} ref={ref} />
            <div className={"mt-4"}>
              <Button
                color="secondary"
                onClick={sign}
                disabled={isSigning}
                startIcon={<RiEdit2Line />}
              >
                {t("sign")}
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <ErrorBox
          title="Read "
          text="Looks like you haven't read the document "
        />
      )}
    </div>
  );
};
