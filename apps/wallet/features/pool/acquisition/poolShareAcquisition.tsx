import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { PoolHeader } from "../components/poolHeader";
import { IfEligibleForAcquisition } from "./ifEligibleForAcquisition";
import { HasSignedTermsOfRisk } from "@/features/pool/acquisition/hasSignedTermsOfRisk";
import { FormWizard } from "@/app/components/formWizard";
import { type AcquisitionFormData } from "@/features/pool/acquisition/acquisitionFormData";
import {
  StepPaymentPix,
  StepPaymentUsdc1,
  StepPaymentUsdc2,
  StepPaymentUsdc3,
  StepSelectPaymentMethod,
  StepSelectQuantity,
} from "@/features/pool/acquisition/steps";

export const AcquisitionSteps = {
  pix: [StepSelectQuantity, StepSelectPaymentMethod, StepPaymentPix],
  usdc: [
    StepSelectQuantity,
    StepSelectPaymentMethod,
    StepPaymentUsdc1,
    StepPaymentUsdc2,
    StepPaymentUsdc3,
  ],
};

interface Props {
  poolId: string;
}

export const PoolShareAcquisition = ({ poolId }: Props) => {
  const pool = useAppSelector(selectPoolContractState(poolId));
  if (!pool) return null;

  const initialState: AcquisitionFormData = {
    paid: false,
    paymentMethod: "pix",
    quantity: 1,
    usdcProtocol: "eth",
    poolId,
  };

  return (
    <div className="overflow-hidden">
      <PoolHeader poolData={pool} />
      <IfEligibleForAcquisition>
        <HasSignedTermsOfRisk poolId={poolId}>
          <FormWizard<AcquisitionFormData>
            stepCount={AcquisitionSteps[initialState.paymentMethod].length}
            initialData={initialState}
          >
            {(props) => {
              const steps = AcquisitionSteps[props.formData.paymentMethod];
              if (props.stepCount !== steps.length) {
                props.updateStepCount(steps.length);
              }
              const Step = steps[props.step - 1];
              if (!Step) return null;
              return <Step {...props} />;
            }}
          </FormWizard>
        </HasSignedTermsOfRisk>
      </IfEligibleForAcquisition>
    </div>
  );
};
