import { AnimatedIconRoadBlock } from "@/app/components/animatedIcons/animatedIconRoadBlock";

export const Error404Page = () => {
  return (
    <div className="my-5 p-4">
      <div className="w-[240px] mx-auto">
        <AnimatedIconRoadBlock loopDelay={5000} touchable />
      </div>
      <article className="prose mx-auto">
        <h2 className="text-center">Ooops, this is unexpected</h2>
        <p className="text-justify md:text-left">
          We apologize for this unpleasant event. Even if there is a small
          chance that the problem is in front of the monitor, we feel fully
          responsible for this mishap. We kindly ask you to return to the
          previous page.
        </p>
        <p>
          If this problem persist, do not hesitate to contact us immediately.
        </p>
      </article>
    </div>
  );
};
