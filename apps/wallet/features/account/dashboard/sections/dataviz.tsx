import { FC } from "react";
import { AccountData } from "@/types/accountData";

interface Props {
  accountData: AccountData;
}

export const Dataviz: FC<Props> = ({ accountData }) => {
  return (
    <div>
      <div>DataViz</div>
    </div>
  );
};
