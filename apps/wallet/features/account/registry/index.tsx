// @ts-ignore
import JotForm from "jotform-react";
import { useAppContext } from "@/app/hooks/useAppContext";

export const Registry = () => {
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
        style={{ height: "calc(100vh - 64px)" }}
      />
    </div>
  );
};
