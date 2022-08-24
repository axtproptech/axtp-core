import { FC } from "react";
import { AccountData } from "@/types/accountData";
import { mockedData } from "./mockedData";
import { ResponsiveLine } from "@nivo/line";

interface Props {
  accountData: AccountData;
}

export const Dataviz: FC<Props> = ({ accountData }) => {
  return (
    <div className="h-[240px] relative">
      <ResponsiveLine
        data={mockedData}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        curve="natural"
        layers={["lines"]}
        yFormat=" >-.2f"
        lineWidth={4}
        isInteractive={false}
      />
    </div>
  );
};
