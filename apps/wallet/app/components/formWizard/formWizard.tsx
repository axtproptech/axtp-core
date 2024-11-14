import { ReactNode } from "react";
import { useFormWizard } from "@/app/hooks/useFormWizard";
import { FormWizardProgress } from "./formWizardProgress";

export interface FormWizardStepProps<T, V = any> {
  step: number;
  data: T;
  updateData: (key: keyof T, value: V) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export interface FormWizardProps<T, V = any> {
  stepCount: number;
  initialState: T;
  children: (props: FormWizardStepProps<T, V>) => ReactNode;
}

export function FormWizard<T, V>({
  children,
  stepCount,
  initialState,
}: FormWizardProps<T, V>) {
  const props = useFormWizard<T, V>(initialState, stepCount);

  return (
    <div>
      <FormWizardProgress currentStep={props.step} steps={stepCount} />
      <div>{children(props)}</div>
    </div>
  );
}
