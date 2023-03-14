// @ts-ignore
import JotForm from "jotform-react";
import { useAppContext } from "@/app/hooks/useAppContext";
import { isIOS } from "mobile-device-detect";

export const JotformRegistry = () => {
  const { JotFormId } = useAppContext();

  return (
    <div>
      <JotForm
        formURL={`https://form.jotform.com/${JotFormId}`}
        formID={JotFormId}
        style={{ height: isIOS ? "calc(100vh - 128px)" : "calc(100vh - 64px)" }}
      />
    </div>
  );
};
