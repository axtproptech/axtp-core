import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { useAppDispatch } from "@/states/hooks";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useNotification } from "@/app/hooks/useNotification";
import { Layout } from "@/app/components/layout";
import { voidFn } from "@/app/voidFn";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { InitialSetupStep } from "@/app/types/kycData";
import { initialSetupFormSchema } from "./validation/schemas";
import { EmailValidation } from "./steps/EmailValidation";
import { Steps } from "./types/steps";
import { Form } from "./steps/Form";
import { kycActions } from "../../state";
import { FormProgressTracker } from "../components/FormProgressTracker";

export const InitialSetup = () => {
  const { t } = useTranslation();
  const { KycService } = useAppContext();
  const { showError, showInfo } = useNotification();
  const { setInitialSetupStep, reset } = kycActions;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [currentStep, setCurrentStep] = useState(Steps.Form);
  const methods = useForm<InitialSetupStep>({
    mode: "onChange",
    resolver: yupResolver(initialSetupFormSchema),
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

  const moveToCodeVerificationStep = async () => {
    const newStep = Steps.VerifyCode;
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const moveToFormStep = async () => {
    const newStep = Steps.Form;
    setCurrentStep(newStep);
    await router.push(`#step${newStep}`, `#step${newStep}`, { shallow: true });
  };

  const handleBackButton = async () => {
    switch (currentStep) {
      case Steps.Form:
        await router.replace("/kyc");
        break;

      case Steps.VerifyCode:
        await moveToFormStep();
        break;

      default:
        break;
    }
  };

  const onSubmit: SubmitHandler<InitialSetupStep> = async (data) => {
    const { firstName, lastName, email } = data;

    switch (currentStep) {
      case Steps.Form:
        try {
          const response = await KycService.fetchCustomerDataByEmail(email);
          if (response) {
            await router.replace("/account/import");
            return showInfo(t("account_already_created"));
          }

          setIsSendingRequest(true);
          await KycService.sendAddressVerificationMail(email, firstName);

          await moveToCodeVerificationStep();
        } catch (e: any) {
          switch (e.message) {
            case "Blocked":
              showError(t("email_blocked", { email }));
              break;

            case "Too many requests":
              showError(t("wait_time_for_token_req"));
              break;

            default:
              showError(e);
              break;
          }
        } finally {
          setIsSendingRequest(false);
        }
        break;

      case Steps.VerifyCode:
        try {
          setIsSendingRequest(true);

          await KycService.verifyEmailVerificationToken(email, code);

          dispatch(reset());

          // Now with a clean KYCState, start the KYC wizard
          dispatch(setInitialSetupStep({ firstName, email, lastName, code }));

          await router.push("/kyc/setup/wizard");
        } catch (e: any) {
          switch (e.message) {
            case "invalid":
              showError(t("invalid_token"));
              break;

            default:
              showError(e);
              break;
          }
        } finally {
          setIsSendingRequest(false);
        }
        break;

      default:
        break;
    }
  };

  const firstNameFieldError = !!errors.firstName?.message;
  const lastNameFieldError = !!errors.lastName?.message;
  const emailFieldError = !!errors.email?.message;
  const codeFieldError = !!errors.code?.message;

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
      label: isSendingRequest ? t("loading") + "..." : t("next"),
      icon: <RiArrowRightCircleLine />,
      disabled: !canSubmit || isSendingRequest,
      loading: isSendingRequest,
      color: "secondary",
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormProgressTracker />
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
