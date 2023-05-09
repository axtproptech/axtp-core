import { useState, useEffect, useCallback } from "react";
import { PrevButton, NextButton } from "./components/ArrowButtons";

import useEmblaCarousel from "embla-carousel-react";

const Carousel = ({ articles }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({});
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const images = [
    "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/681368/pexels-photo-681368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/681333/pexels-photo-681333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  const SLIDE_COUNT = images.length;
  const slides = Array.from(Array(SLIDE_COUNT).keys());

  const imageByIndex = (index) => images[index % images.length];

  console.log("articles", articles);

  return (
    <div
      className="embla max-w-6xl h-96 xs:rounded-none md:rounded-3xl bg-yellow-900 mx-auto shadow-lg bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 overflow-hidden"
      style={{
        border: "1px #3D3D3D solid",
      }}
    >
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <span>{index + 1}</span>
              </div>
              <img
                className="embla__slide__img"
                src={imageByIndex(index)}
                alt="Your alt text"
              />
            </div>
          ))}
        </div>
      </div>

      <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
      <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
    </div>
  );
};

export default Carousel;
