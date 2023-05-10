import { SpanWrapper } from "../../styles/landingPage.style";

import Carousel from "containers/Exclusive/components/Carousel";
import GradientBackground from "../../components/GradientBackground";

export const Welcome = ({ articles }) => {
  return (
    <div className="relative mx-auto pt-32 mb-24">
      <GradientBackground />

      <img
        className="absolute top-0 left-0 mx-auto w-full -z-50 object-cover xs:h-full md:h-auto"
        src="assets/exclusive/digitalBuilding.webp"
        style={{ opacity: 0.03 }}
      />

      <h1 className="xs:hidden md:block text-6xl text-white text-center mb-4 font-black select-none">
        Reimagine
        <SpanWrapper className="xs:text-4xl md:text-6xl p-4 font-black inline-block">
          Real Estate
        </SpanWrapper>
        Market
        <br />
        with digital assets
      </h1>

      <SpanWrapper className="xs:block md:hidden text-6xl text-white text-center mb-4 font-black select-none">
        Reimagine Real Estate Market
      </SpanWrapper>

      <p className="xs:text-xl md:text-2xl  xs:mb-8 md:mb-20 text-white text-center opacity-80 max-w-2xl mx-auto">
        Revamp real estate through digital assets and blockchain, for a more
        efficient and accessible market.
      </p>

      <Carousel articles={articles} />
    </div>
  );
};
