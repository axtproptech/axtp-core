import { ChildrenProps } from "@/types/childrenProps";
import { useAccount } from "@/app/hooks/useAccount";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useRouter } from "next/router";
import { HintNotSigned } from "@/features/pool/acquisition/hasSignedTermsOfRisk/hintNotSigned";
import { HintExpired } from "@/features/pool/acquisition/hasSignedTermsOfRisk/hintExpired";
import { SignableDocumentType } from "@/types/signableDocumentType";

interface Props extends ChildrenProps {
  poolId: string;
}

export const HasSignedTermsOfRisk = ({ children, poolId }: Props) => {
  const { customer } = useAccount();
  const { TrackingEventService } = useAppContext();
  const router = useRouter();

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
    (doc) =>
      doc.type === SignableDocumentType.TermsOfRisk && doc.poolId === poolId
  );

  if (!foundSignedDocument) {
    return <HintNotSigned onSubmit={navigateToSigning("notSigned")} />;
  }

  if (foundSignedDocument && foundSignedDocument.isExpired) {
    return <HintExpired onSubmit={navigateToSigning("expired")} />;
  }

  return <>{children}</>;
};
