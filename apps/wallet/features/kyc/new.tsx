// @ts-ignore
import JotForm from "jotform-react";
import { useAppContext } from "@/app/hooks/useAppContext";
import { isIOS } from "mobile-device-detect";

export const NewKYC = () => {
  const { JotFormId } = useAppContext();

  const handleOnSubmit = (data: any) => {
    console.log("handleSubmit", data);
  };

  return (
    <div>
      <JotForm
        formURL={`https://form.jotform.com/${JotFormId}`}
        formID={JotFormId}
        onSubmit={handleOnSubmit}
        style={{ height: isIOS ? "calc(100vh - 128px)" : "calc(100vh - 64px)" }}
      />
    </div>
  );
};
