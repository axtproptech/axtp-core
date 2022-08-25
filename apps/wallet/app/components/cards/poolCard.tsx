import { FC, MouseEventHandler } from "react";
import { voidFn } from "@/app/voidFn";
import { PoolContractData } from "@/types/poolContractData";

interface Props {
  poolData: PoolContractData;
  accountShares?: number;
  onClick?: MouseEventHandler;
  className?: string;
}

export const PoolCard: FC<Props> = ({
  onClick = voidFn,
  className = "",
  poolData,
  accountShares = 0,
}) => {
  return (
    <div className={className}>
      <div
        className="card w-full glass cursor-pointer h-full"
        onClick={onClick}
      >
        {/*<figure>*/}
        {/*    <img src="https://placeimg.com/400/225/arch" alt="car!"/>*/}
        {/*    </figure>*/}
        <div className="card-body">
          <div className="flex flex-row justify-between items-start">
            <h2 className="card-title">Title</h2>
          </div>
          <p>Text</p>
          <div className="card-actions justify-between">
            {/*<button classNameName="btn btn-primary">Learn now!</button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};
