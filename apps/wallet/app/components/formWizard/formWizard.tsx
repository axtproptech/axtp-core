import { useCallback, useEffect, useState } from "react";
import { FormWizardProgress } from "./formWizardProgress";
import { ValidationError } from "yup";
import { voidFn } from "@/app/voidFn";

export type FormErrorType<T> = Record<Partial<keyof T>, string>;

export interface FormWizardValidation<T> {
  errors?: FormErrorType<T>;
  hasError: boolean;
  setError: (key: keyof T, message: string) => void;
  clearErrors: () => void;
}

export interface FormWizardStepProps<T, V = any> {
  step: number;
  stepCount: number;
  formData: T;
  updateStepCount: (count: number) => void;
  updateFormData: (key: keyof T, value: V) => void;
  nextStep: () => void;
  previousStep: () => void;
  validation: FormWizardValidation<T>;
}

export interface FormWizardProps<T, V = any> {
  stepCount: number;
  initialData: T;
  children: (props: FormWizardStepProps<T, V>) => React.ReactNode;
  validate?: (data: T, validation: FormWizardValidation<T>) => void;
}

export function FormWizard<T, V = any>({
  children,
  stepCount: _stepCount,
  initialData,
  validate,
}: FormWizardProps<T, V>) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, _setError] = useState<FormErrorType<T>>(
    {} as FormErrorType<T>
  );
  const [stepCount, setStepCount] = useState(_stepCount);
  const [isDirty, setIsDirty] = useState(false);
  const hasError = errors && Object.keys(errors).length > 0;

  const clearErrors = () => {
    _setError({} as FormErrorType<T>);
  };

  const setError = (key: keyof T, message: string) => {
    _setError((e) => ({ ...e, [key]: message }));
  };

  const updateFormData = (key: keyof T, value: V) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, stepCount));
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 0));
  const updateStepCount = (count: number) => {
    if (count < 0 || count > 10) {
      console.error("Trying to set invalid step count - ignored", count);
      return;
    }
    setStepCount(count);
    setStep((prev) => Math.min(prev, count));
  };

  const validation = {
    errors,
    hasError,
    setError,
    clearErrors,
  };

  useEffect(() => {
    if (validate && isDirty) {
      clearErrors();
      validate(formData, validation);
      setIsDirty(false);
    }
  }, [validate, isDirty]);

  return (
    <div>
      <FormWizardProgress currentStep={step} steps={stepCount} />
      <div>
        {children({
          step,
          stepCount,
          updateStepCount,
          nextStep,
          previousStep,
          formData,
          validation,
          updateFormData,
        })}
      </div>
    </div>
  );
}
