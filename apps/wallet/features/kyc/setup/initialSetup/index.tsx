import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { useNotification } from "@/app/hooks/useNotification";
import { Layout } from "@/app/components/layout";
import { voidFn } from "@/app/voidFn";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { InitialStep } from "@/app/types/kycData";
import { initialFormSchema } from "./validation/schemas";
import { EmailValidation } from "./steps/EmailValidation";
import { Steps } from "./types/steps";
import { Form } from "./steps/Form";

export const InitialSetup = () => {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(Steps.Form);
  const methods = useForm<InitialStep>({
    mode: "onChange",
    resolver: yupResolver(initialFormSchema),
    defaultValues: { firstName: "", lastName: "", email: "", code: "" },
  });

  const {
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const email = watch("email");
  const code = watch("code");

  const moveToCodeVerificaitonStep = async () => {
    const newStep = Steps.VerifyCode;
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const moveToFormStep = async () => {
    const newStep = Steps.Form;
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const handleBackButton = () => {
    switch (currentStep) {
      case Steps.Form:
        router.replace("/kyc");
        break;

      case Steps.VerifyCode:
        moveToFormStep();
        break;

      default:
        break;
    }
  };

  const onSubmit: SubmitHandler<InitialStep> = async (data) => {
    switch (currentStep) {
      // TODO: Send request to API for getting email code
      // As discussed, temportal DB table will be created for email validation
      case Steps.Form:
        moveToCodeVerificaitonStep();
        showError(
          "Any Kind of notification (Rate-limiting, Already existing verified email)"
        );
        break;

      // TODO: Send request to API for populating the initial user data
      // TODO: Persist Initial Data on Redux
      // Initial data is (First Name, Last Name and email)
      case Steps.VerifyCode:
        router.push("/kyc/setup/wizard");
        break;

      default:
        break;
    }
  };

  let firstNameFieldError = !!errors.firstName?.message;
  let lastNameFieldError = !!errors.lastName?.message;
  let emailFieldError = !!errors.email?.message;
  let codeFieldError = !!errors.code?.message;

  let canSubmit = false;

  switch (currentStep) {
    case Steps.Form:
      canSubmit = !!(
        firstName &&
        lastName &&
        email &&
        !firstNameFieldError &&
        !lastNameFieldError &&
        !emailFieldError
      );
      break;

    case Steps.VerifyCode:
      canSubmit = !!(code && !codeFieldError);
      break;

    default:
      break;
  }

  const bottomNav: BottomNavigationItem[] = [
    {
      label: t("back"),
      icon: <RiArrowLeftCircleLine />,
      onClick: handleBackButton,
      type: "button",
    },
    {
      onClick: voidFn,
      label: "",
      icon: <div />,
    },
    {
      onClick: () => handleSubmit(onSubmit),
      label: t("next"),
      icon: <RiArrowRightCircleLine />,
      disabled: !canSubmit,
      color: "secondary",
    },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Layout bottomNav={bottomNav}>
          <div className="carousel w-full mx-[2px] overflow-x-hidden">
            <div id="step0" className="carousel-item relative w-full">
              <Form />
            </div>
            <div id="step1" className="carousel-item relative w-full">
              <EmailValidation />
            </div>
          </div>
        </Layout>
      </form>
    </FormProvider>
  );
};
