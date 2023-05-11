import { motion } from "framer-motion";
import { SpanWrapper } from "../../styles/landingPage.style";

import Carousel from "containers/Exclusive/components/Carousel";
import GradientBackground from "../../components/GradientBackground";

export const Welcome = ({ articles }) => {
  return (
    <div className="relative mx-auto pt-32 pb-24">
      <motion.div
        animate={{ opacity: [0, 1, 0] }}
        transition={{ ease: "easeIn", duration: 3, repeat: Infinity }}
      >
        <GradientBackground opacity={0.3} />
      </motion.div>

      <h1 className="xs:hidden md:block text-6xl text-white text-center mb-4 font-black select-none">
        Reimagine o
        <SpanWrapper className="xs:text-4xl md:text-6xl p-4 font-black inline-block">
          Mercado Imobiliário
        </SpanWrapper>
        Mundial
        <br />
        com Ativos Digitais
      </h1>

      <SpanWrapper className="xs:block md:hidden text-6xl text-white text-center mb-4 font-black select-none">
        Reimagine o Mercado Imobiliário
      </SpanWrapper>

      <p className="xs:text-xl xs:px-2 md:text-2xl  xs:mb-8 md:mb-20 text-white text-center opacity-80 max-w-2xl mx-auto">
        Renovar o setor imobiliário por meio de ativos digitais na blockchain,
        para maior transparência, segurança e acesso mais fácil.
      </p>

      <Carousel articles={articles} />
    </div>
  );
};
