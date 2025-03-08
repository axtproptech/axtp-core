import { Icon } from "react-icons-kit";
import { thinDown } from "react-icons-kit/entypo/thinDown";
import { thinRight } from "react-icons-kit/entypo/thinRight";
import {
  Accordion,
  AccordionItem,
  AccordionTitle,
  AccordionBody,
  IconWrapper,
  OpenIcon,
  CloseIcon,
} from "common/components/Accordion";
import ReactMarkdown from "react-markdown";

export const Faq = ({ faqs }) => {
  return (
    <>
      <p className="text-white text-center text-3xl font-bold mb-4">
        Perguntas Frequentes
      </p>

      <div
        className="relative w-full max-w-2xl mx-auto rounded-2xl p-4 shadow-lg xs:mb-0 md:mb-20"
        style={{
          border: "1px #3D3D3D solid",
          boxShadow: "0 0 291px 55px hsla(0,0%,100%,.05)",
        }}
      >
        <Accordion>
          <>
            {faqs.map((f) => (
              <AccordionItem key={f.id} className="py-4">
                <>
                  <AccordionTitle>
                    <>
                      <p className="text-lg text-white opacity-80">
                        {f.content.question}
                      </p>

                      <IconWrapper>
                        <OpenIcon>
                          <Icon
                            icon={thinRight}
                            size={18}
                            className="text-yellow-500"
                          />
                        </OpenIcon>

                        <CloseIcon>
                          <Icon
                            icon={thinDown}
                            size={18}
                            className="text-yellow-500"
                          />
                        </CloseIcon>
                      </IconWrapper>
                    </>
                  </AccordionTitle>

                  <AccordionBody>
                    <p className=" text-yellow-500 opacity-80 mt-2 font-medium">
                      <ReactMarkdown>{f.content.answer}</ReactMarkdown>
                    </p>
                  </AccordionBody>
                </>
              </AccordionItem>
            ))}
          </>
        </Accordion>

        <p className="my-8 text-yellow-100 text-justify opacity-50 text-sm w-full max-w-2xl mx-auto">
          Se você tiver alguma pergunta que não tenha sido respondida ou que não
          tenha sido suficientemente respondida abaixo,{" "}
          <a
            className="underline text-yellow-200 opacity-100"
            href="mailto:support@axtp.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            envie-nos um e-mail
          </a>{" "}
          ou pergunte-nos no grupo do Whatsapp.
        </p>
      </div>
    </>
  );
};
