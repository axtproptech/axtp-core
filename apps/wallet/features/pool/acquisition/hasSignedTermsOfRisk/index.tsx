import { FC, useMemo } from "react";
import { ChildrenProps } from "@/types/childrenProps";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useRouter } from "next/router";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { Button } from "react-daisyui";
import { RegisterCustomerButton } from "@/app/components/buttons/registerCustomerButton";
import { VerificationStatus } from "@/app/components/verificationStatus";
import { useTranslation } from "next-i18next";
import { RiWallet3Line } from "react-icons/ri";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";
import { HintNotSigned } from "@/features/pool/acquisition/hasSignedTermsOfRisk/hintNotSigned";
import { HintExpired } from "@/features/pool/acquisition/hasSignedTermsOfRisk/hintExpired";
import { SignedDocumentSafeData } from "@/types/signedDocumentSafeData";

interface Props extends ChildrenProps {
  poolId: string;
}

export const HasSignedTermsOfRisk = ({ children, poolId }: Props) => {
  const { accountPublicKey, customer } = useAccount();
  const { TrackingEventService } = useAppContext();
  const router = useRouter();
  const { t } = useTranslation();

  const navigateToSigning = (reason: string) => async () => {
    TrackingEventService.track({ msg: "Click Navigate Signing" });
    await router.push(
      `/kyc/signing?poolId=${poolId}&reason=${reason}&type=TermsOfRisk&redirect=${encodeURIComponent(
        location.toString()
      )}`
    );
  };

  // docs are ordered by date desc...so most recent is on top!
  const foundSignedDocument = customer?.signedDocuments.find(
    (doc) => doc.type === "TermsOfRisk" && doc.poolId === poolId
  );

  if (!foundSignedDocument) {
    return <HintNotSigned onSubmit={navigateToSigning("notSigned")} />;
  }

  if (foundSignedDocument && foundSignedDocument.isExpired) {
    return <HintExpired onSubmit={navigateToSigning("expired")} />;
  }

  return <>{children}</>;
};
