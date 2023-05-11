import { useState, useEffect, useCallback } from "react";
import { PrevButton, NextButton } from "./components/ArrowButtons";
import { Icon } from "react-icons-kit";
import { arrowUpRight } from "react-icons-kit/feather/arrowUpRight";

import Link from "next/link";
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
            <Link href="/exclusive/blog" passHref key={index}>
              <a className="relative embla__slide">
                <div className="w-full h-full absolute top-0 right-0 bg-gradient-to-t from-stone-950 from-5% to-transparent px-8 py-4 flex items-end ">
                  <div className="flex w-full justify-center items-center gap-2">
                    <h3 className="z-1 font-medium !leading-tight xs:text-lg md:text-2xl  text-white">
                      New investment opportunity
                    </h3>

                    <button className="btn btn-circle xs:btn-xs md:btn-sm">
                      {<Icon icon={arrowUpRight} />}
                    </button>
                  </div>
                </div>

                <div className="embla__slide__number">
                  <span>{index + 1}</span>
                </div>

                <img
                  className="embla__slide__img"
                  src={imageByIndex(index)}
                  alt="Your alt text"
                />
              </a>
            </Link>
          ))}
        </div>
      </div>

      <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
      <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
    </div>
  );
};

export default Carousel;
