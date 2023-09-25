import { useAppContext } from "@/app/hooks/useAppContext";

export const Wizard = () => {
  const { JotFormId } = useAppContext();

  return <div>Account Registration Wizard</div>;
};
