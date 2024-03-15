import { ActionCard } from "@/app/components/cards";
import { IconCirclePlus, IconUserSearch } from "@tabler/icons";
import { Box, Stack, Tooltip } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { SelectInput, SelectOption, TextInput } from "@/app/components/inputs";
import { styled } from "@mui/material/styles";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useAppSelector } from "@/states/hooks";
import { selectAllPools } from "@/app/states/poolsState";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { PaymentTypesLabelMap } from "@/features/payments/paymentTypesLabelMap";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { Address } from "@signumjs/core";
import { customerService } from "@/app/services/customerService/customerService";
import { CustomerResponse } from "@/bff/types/customerResponse";
import { formatCpfCnpj } from "@/app/formatCpfCnpj";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { paymentsService } from "@/app/services/paymentService/paymentService";

const FullBox = styled(Box)(() => ({
  width: "100%",
}));

type FormValues = {
  customerPubKey: string;
  poolId: string;

  tokenCount: number;
  tokenPrice: number;
  paymentType: string;
  paidAmount: number;
  paymentReference: string;
};

const required = {
  value: true,
  message: "The field is required",
};

const paymentOptions = Object.entries(PaymentTypesLabelMap).map(([k, v]) => ({
  value: k,
  label: v,
}));

const PublicKeyPattern = /^[a-fA-F0-9]{64}$/;

const getCurrency = (paymentType: string): "brl" | "usd" =>
  paymentType.startsWith("usd") ? "usd" : "brl";

export const RegisterPaymentCard = () => {
  const router = useRouter();
  const { token } = useMasterContract();
  const { showError, showSuccess } = useSnackbar();
  const pools = useAppSelector(selectAllPools);
  const [resolvedCustomer, setResolvedCustomer] =
    useState<CustomerResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [numberValues, setNumberValues] = useState({
    paidAmount: 0.0,
    tokenCount: 0,
    tokenPrice: pools.length ? pools[0].tokenRate : 0,
  });

  const {
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      customerPubKey: (router.query.pk as string) || "",
      poolId: pools.length ? pools[0].poolId : "",
      tokenCount: 0,
      tokenPrice: pools.length ? pools[0].tokenRate : 0,
      paidAmount: 0,
      paymentType: "pix",
      paymentReference: "",
    },
  });

  const customerPubKey = watch("customerPubKey");
  const paymentType = watch("paymentType");
  const poolId = watch("poolId");
  const tokenPrice = watch("tokenPrice");

  const poolOptions = useMemo(() => {
    if (!pools) return [];

    return pools.map((p, index) => {
      return {
        value: p.poolId,
        label: p.token.name,
      } as SelectOption;
    });
  }, [pools]);

  const selectedPool = useMemo(() => {
    if (!(pools && poolId)) return;
    return pools.find((p) => p.poolId === poolId);
  }, [pools, poolId]);

  useEffect(() => {
    if (selectedPool && !tokenPrice) {
      setValue("tokenPrice", selectedPool.tokenRate);
      setNumberValues({ ...numberValues, tokenPrice: selectedPool.tokenRate });
    }
  }, [selectedPool, tokenPrice]);

  const resetForm = () => {
    reset();
    setNumberValues({ paidAmount: 0, tokenCount: 0, tokenPrice: 0 });
  };

  const resolvedCustomerName = useMemo(() => {
    if (!resolvedCustomer) return "";
    return `${resolvedCustomer.firstName} ${
      resolvedCustomer.lastName
    } (CPF: ${formatCpfCnpj(resolvedCustomer.cpfCnpj)})`;
  }, [resolvedCustomer]);

  useEffect(() => {
    try {
      setResolvedCustomer(null);
      if (PublicKeyPattern.test(customerPubKey)) {
        const address = Address.fromPublicKey(customerPubKey);
        customerService
          .fetchCustomerByAccountId(address.getNumericId())
          .then((c) => {
            setResolvedCustomer(c);
          });
      }
    } catch (e) {
      setResolvedCustomer(null);
    }
  }, [customerPubKey]);

  const handleRegisterPayment = async () => {
    if (!resolvedCustomer) return;
    if (!selectedPool) return;

    const formValues = getValues();
    const currency = getCurrency(formValues.paymentType);
    const usd =
      currency === "usd"
        ? numberValues.paidAmount.toString()
        : (numberValues.tokenPrice * numberValues.tokenCount).toString();
    const amount = numberValues.paidAmount.toString();
    const tokenQnt = numberValues.tokenCount.toString();
    setIsExecuting(true);
    try {
      await paymentsService.registerPayment({
        customerId: resolvedCustomer?.cuid,
        accountPk: formValues.customerPubKey,
        usd,
        paymentType,
        txId: formValues.paymentReference,
        poolId: formValues.poolId,
        tokenId: selectedPool.token.id,
        tokenName: selectedPool.token.name,
        tokenQnt,
        currency,
        amount,
      });
      showSuccess("Successfully registered payment");
      resetForm();
    } catch (e: any) {
      showError(`Something failed: ${e.message}`);
      throw e;
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSearch = () => {
    return router.push("/admin/customers");
  };

  const handleNumberChange =
    (field: "tokenCount" | "paidAmount" | "tokenPrice") =>
    (values: NumberFormatValues) => {
      setNumberValues({ ...numberValues, [field]: values.floatValue });
    };

  return (
    <ActionCard
      title="Register Payment"
      description="Here you can register realized payments by customer who wants to buy tokens."
      actionIcon={<IconCirclePlus />}
      actionLabel="Register Payment"
      onClick={handleRegisterPayment}
      isLoading={isExecuting}
      disabled={!isValid}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 0, md: 2 }}
        alignItems="center"
      >
        <Controller
          render={({ field, fieldState: { error } }) => (
            <TextInput
              label="Customer Public Key"
              {...field}
              error={error ? error.message : ""}
              hint={
                resolvedCustomerName
                  ? resolvedCustomerName
                  : "Use the public key to identify a customer."
              }
            />
          )}
          name="customerPubKey"
          control={control}
          // @ts-ignore
          variant="outlined"
          rules={{
            required: true,
            pattern: {
              value: PublicKeyPattern,
              message: "Invalid Public Key",
            },
          }}
        />
        <Tooltip arrow title={"Search Customer"}>
          <div>
            <ActionButton
              actionLabel={""}
              color="grey"
              actionIcon={<IconUserSearch />}
              onClick={handleSearch}
              sx={{ ml: 1 }}
            />
          </div>
        </Tooltip>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            render={({ field }) => (
              <SelectInput
                label="Select Pool"
                options={poolOptions}
                {...field}
              />
            )}
            name="poolId"
            control={control}
            // @ts-ignore
            variant="outlined"
          />
        </FullBox>
        <FullBox>
          <Controller
            render={({ field }) => (
              <NumericFormat
                label="Amount of Tokens"
                color="primary"
                decimalScale={0}
                fixedDecimalScale
                thousandSeparator
                // @ts-ignore
                control={control}
                {...field}
                customInput={TextInput}
                onValueChange={handleNumberChange("tokenCount")}
              />
            )}
            name="tokenCount"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{
              required,
            }}
          />
        </FullBox>
        <FullBox>
          <Controller
            render={({ field }) => (
              <NumericFormat
                label="Price per Token"
                color="primary"
                decimalScale={token.decimals}
                suffix={` ${token.name}`}
                fixedDecimalScale
                thousandSeparator
                // @ts-ignore
                control={control}
                {...field}
                customInput={TextInput}
                onValueChange={handleNumberChange("tokenPrice")}
              />
            )}
            name="tokenPrice"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{
              required,
            }}
          />
        </FullBox>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            render={({ field }) => (
              <SelectInput
                label="Select Payment Type"
                options={paymentOptions}
                {...field}
              />
            )}
            name="paymentType"
            control={control}
            // @ts-ignore
            variant="outlined"
          />
        </FullBox>
        <FullBox>
          <Controller
            render={({ field }) => (
              <NumericFormat
                label="Received Amount"
                color="primary"
                suffix={` ${getCurrency(paymentType).toUpperCase()}`}
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                // @ts-ignore
                control={control}
                {...field}
                customInput={TextInput}
                onValueChange={handleNumberChange("paidAmount")}
              />
            )}
            name="paidAmount"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{
              required,
            }}
          />
        </FullBox>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 2 }}>
        <FullBox>
          <Controller
            render={({ field }) => (
              <TextInput
                label="Payment Reference"
                {...field}
                hint="The reference is used to identify a payment on external systems. It can be a transaction Id on the blockchain, or PIX Transaction Code, etc. "
              />
            )}
            name="paymentReference"
            control={control}
            // @ts-ignore
            variant="outlined"
            rules={{
              required: true,
            }}
          />
        </FullBox>
      </Stack>
    </ActionCard>
  );
};
