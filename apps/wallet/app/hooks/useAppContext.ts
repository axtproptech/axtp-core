import { useContext } from "react";
import { AppContext, AppContextType } from "@/app/contexts/appContext";

export const useAppContext = (): AppContextType => {
  return useContext(AppContext);
};
