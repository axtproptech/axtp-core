import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import { Button, Input } from "react-daisyui";
import { useAppContext } from "@/app/hooks/useAppContext";
import { CustomerSafeData } from "@/types/customerSafeData";
import { useNotification } from "@/app/hooks/useNotification";
import { useIMask } from "react-imask";
import { RiRestartLine, RiSearchLine } from "react-icons/ri";
import { HintBox } from "@/app/components/hintBox";
import { Greeting } from "@/app/components/greeting";

interface Props {
  onCustomerChanged: (c: CustomerSafeData | null) => void;
  onAllowRegistry: (allow: boolean) => void;
}

export const StepEnterCpf: FC<Props> = ({
  onCustomerChanged,
  onAllowRegistry,
}) => {
  const { t } = useTranslation();
  const { KycService } = useAppContext();
  const [customer, setCustomer] = useState<CustomerSafeData | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { showError, showWarning } = useNotification();
  const { ref, unmaskedValue, setValue } = useIMask({ mask: "000.000.000-00" });

  const handleVerifyCpf = async () => {
    try {
      setIsFetching(true);
      const c = await KycService.fetchCustomerDataByCpf(unmaskedValue);
      if (c.publicKey) {
        showWarning(t("kyc_cpf_has_pk"));
      } else {
        onAllowRegistry(false);
        setCustomer(c);
      }
    } catch (e) {
      showError(t("kyc_cpf_not_found"));
      onAllowRegistry(true);
    } finally {
      setIsFetching(false);
    }
  };

  function handleReset() {
    setCustomer(null);
    setValue("");
    setIsFetching(false);
  }

  useEffect(() => {
    onCustomerChanged(customer);
  }, [onCustomerChanged, customer]);

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h2>{t("enter_cpf_hint")}</h2>
      </section>
      <section>
        <HintBox text={customer ? undefined : t("kyc_link_account_hint")}>
          {customer && <Greeting />}
        </HintBox>
      </section>
      <section>
        <div className="relative w-fit mx-auto mb-4">
          <Input
            ref={ref}
            className="text-center border-base-content font-bold"
            type={"text"}
            size="lg"
            placeholder={t("cpf_input_placeholder")}
            disabled={isFetching || !!customer}
          />
          {/*{isFetching && }*/}
        </div>
        <div className="flex flex-row justify-around items-center">
          <Button
            disabled={isFetching || unmaskedValue.length === 0}
            color="ghost"
            onClick={handleReset}
            startIcon={<RiRestartLine />}
          >
            {t("reset")}
          </Button>
          <Button
            loading={isFetching}
            disabled={isFetching || unmaskedValue.length !== 11 || !!customer}
            color="accent"
            onClick={handleVerifyCpf}
            startIcon={<RiSearchLine />}
          >
            {t("verify")}
          </Button>
        </div>
      </section>
      <section />
    </div>
  );
};
