import Lottie, {
  LottieComponentProps,
  LottieRefCurrentProps,
} from "lottie-react";
import { FC, useRef } from "react";

export interface AnimatedIconProps extends LottieComponentProps {
  loopDelay?: number;
  touchable?: boolean;
}

export const AnimatedIcon: FC<AnimatedIconProps> = ({
  loopDelay,
  touchable = false,
  ...rest
}) => {
  let timeoutRef = useRef<NodeJS.Timeout>();
  let ref = useRef<LottieRefCurrentProps | null>(null);

  function cancelTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  function handleAnimationEnd(event: any) {
    if (loopDelay) {
      cancelTimeout();
      timeoutRef.current = setTimeout(() => {
        ref.current?.goToAndPlay(0, true);
      }, loopDelay);
    }

    if (rest.onComplete) {
      rest.onComplete(event);
    }
  }

  function handleOnClick(event: any) {
    if (touchable) {
      cancelTimeout();
      ref.current?.goToAndPlay(0, true);
    }

    if (rest.onClick) {
      rest.onClick(event);
    }
  }

  return (
    <Lottie
      lottieRef={ref}
      loop={false}
      onComplete={handleAnimationEnd}
      onClick={handleOnClick}
      {...rest}
    />
  );
};
