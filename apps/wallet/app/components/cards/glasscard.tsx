import { FC, MouseEventHandler } from "react";
import { voidFn } from "@/app/voidFn";

interface Props {
  title: string;
  text: string;
  onClick?: MouseEventHandler;
  className?: string;
}

export const Glasscard: FC<Props> = ({
  onClick = voidFn,
  title,
  text,
  className = "",
}) => {
  return (
    <div className={className}>
      <div className="card w-full glass cursor-pointer" onClick={onClick}>
        {/*<figure><img src="https://placeimg.com/400/225/arch" alt="car!"></figure>*/}
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{text}</p>
          <div className="card-actions justify-between">
            {/*<button classNameName="btn btn-primary">Learn now!</button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};
