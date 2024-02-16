import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";

export const useAXTCTokenInfo = () => {
  return useAppSelector(selectAXTToken);
};
