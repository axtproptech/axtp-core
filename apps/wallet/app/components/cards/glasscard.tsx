import { FC, MouseEventHandler } from "react";
import { voidFn } from "@/app/voidFn";
import { useAppContext } from "@/app/hooks/useAppContext";

interface Props {
  title: string;
  text: string;
  icon?: any;
  onClick?: MouseEventHandler;
  className?: string;
}

export const Glasscard: FC<Props> = ({
  onClick = voidFn,
  icon = null,
  title,
  text,
  className = "",
}) => {
  const { TrackingEventService } = useAppContext();

  const handleOnClick = async () => {
    TrackingEventService.track({ msg: `${title} Button Pushed` });
  };

  return (
    <div className={className} onClick={handleOnClick}>
      <div
        className="card w-full glass cursor-pointer h-full"
        onClick={onClick}
      >
        {/*<figure><img src="https://placeimg.com/400/225/arch" alt="car!"></figure>*/}
        <div className="card-body">
          <div className="flex flex-row justify-between items-start">
            <h2 className="card-title">{title}</h2>
            {icon}
          </div>
          <p>{text}</p>
          <div className="card-actions justify-between">
            {/*<button classNameName="btn btn-primary">Learn now!</button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};
