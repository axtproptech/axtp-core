import { AnimatedIconStockShare } from "@/app/components/animatedIcons/animatedIconStockShare";

export const Home = () => {
  return (
    <div className="my-5">
      <h1>Home</h1>
      <div className="w-[240px] mx-auto">
        <AnimatedIconStockShare loopDelay={5000} touchable />
      </div>
    </div>
  );
};
