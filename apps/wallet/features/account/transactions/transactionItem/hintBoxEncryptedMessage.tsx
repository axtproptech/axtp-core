import { TransactionData } from "@/types/transactionData";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { actions, selectAgreementKey } from "@/app/states/appState";
import { useEffect, useState } from "react";
import { decryptMessage } from "@signumjs/crypto";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { PinInput } from "@/app/components/pinInput";
import { Button } from "react-daisyui";
import { RiMailOpenLine } from "react-icons/ri";

export const HintBoxEncryptedMessage = ({ tx }: { tx: TransactionData }) => {
  const { getKeys, accountPublicKey } = useAccount();
  const { Ledger } = useAppContext();

  const { t } = useTranslation("transactions");
  const dispatch = useAppDispatch();
  const agreementKey = useAppSelector(selectAgreementKey);
  const [pin, setPin] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDecrypting, setDecrypting] = useState(false);

  const handleOnReveal = async () => {
    try {
      setDecryptedText("");
      setErrorMessage("");
      setDecrypting(true);
      const { agreementPrivateKey } = await getKeys(pin);
      dispatch(actions.setAgreementKey(agreementPrivateKey));
    } catch (e) {
      setErrorMessage(t("wrongPin"));
    } finally {
      setDecrypting(false);
    }
  };

  useEffect(() => {
    const revealMessage = async () => {
      try {
        setDecrypting(true);
        let publicKey = "";
        if (tx.direction === "in") {
          const sender = await Ledger.Client.account.getAccount({
            accountId: tx.sender,
          });
          publicKey = sender.publicKey;
        } else if (tx.direction === "out") {
          const receiver = await Ledger.Client.account.getAccount({
            accountId: tx.receiver,
          });
          publicKey = receiver.publicKey;
        } else {
          throw new Error("No P2P message");
        }

        const message = decryptMessage(
          tx.encryptedMessage!,
          publicKey,
          agreementKey
        );
        setDecryptedText(message);
      } catch (e) {
        setErrorMessage("Decryption failed");
      } finally {
        setDecrypting(false);
      }
    };

    if (agreementKey) {
      revealMessage();
    }
  }, [
    Ledger.Client.account,
    accountPublicKey,
    agreementKey,
    tx.direction,
    tx.encryptedMessage,
    tx.sender,
  ]);

  if (!tx.encryptedMessage) return null;

  return (
    <HintBox className="relative mb-4">
      {!agreementKey && (
        <>
          <p>{t("messageIsEncryptedHint")}</p>
          <div className="flex flex-col justify-center items-center gap-y-2">
            <PinInput onPinChange={setPin} />
            <Button
              color="secondary"
              onClick={handleOnReveal}
              disabled={isDecrypting}
              startIcon={<RiMailOpenLine />}
            >
              {t("reveal")}
            </Button>
            {errorMessage && (
              <small className="text-red-400 text-center w-full">
                {errorMessage}
              </small>
            )}
          </div>
        </>
      )}

      {agreementKey && !decryptedText && (
        <div className="blur-md animate-pulse">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
      )}
      {agreementKey && decryptedText && (
        <div className="relative max-h-[120px] overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent">
          {decryptedText}
        </div>
      )}
    </HintBox>
  );
};
