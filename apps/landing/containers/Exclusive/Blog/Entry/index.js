import { Icon } from "react-icons-kit";
import { ic_keyboard_arrow_left_twotone } from "react-icons-kit/md/ic_keyboard_arrow_left_twotone";
import { motion, useScroll, useTransform } from "framer-motion";

import Link from "next/link";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import ReactMarkdown from "react-markdown";
import Button from "common/components/Button";

export const BlogEntryPage = ({ entry }) => {
  const { createdAt, content } = entry;
  const { scrollYProgress, scrollY } = useScroll();

  const dynamicOpacity = useTransform(scrollY, [0, 1000], [1, 0]);
  const dynamicHeight = useTransform(scrollY, [0, 1500], ["100vh", "0vh"]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-yellow-500 rounded-2xl"
        style={{
          scaleX: scrollYProgress,
          transformOrigin: "0%",
          zIndex: 1500,
        }}
      />

      <div className="fixed top-0 left-0 w-screen h-screen">
        <motion.div
          style={{
            height: dynamicHeight,
            width: "100vw",
            opacity: dynamicOpacity,
          }}
        >
          <img
            src={content.image.url}
            className="w-full h-full object-cover blur-2xl opacity-25 -z-0"
          />
        </motion.div>
      </div>

      <div className="relative flex flex-col pt-32 mb-24 max-w-4xl px-4 mx-auto gap-4">
        <div>
          <Link href="/exclusive/blog" passHref>
            <Button
              icon={<Icon icon={ic_keyboard_arrow_left_twotone} />}
              iconPosition="left"
              disabled={false}
              variant="extenfabvdedFab"
              colors="secondaryWithBg"
              title="Back To Blog"
              onClick={null}
            />
          </Link>
        </div>

        <div className="w-full flex xs:flex-col md:flex-row items-center justify-between px-4 gap-4">
          <div className="badge badge-warning badge-lg gap-2 font-bold">
            Article
          </div>

          <div className="flex items-center justify-start gap-2">
            <div className="avatar">
              <div className="w-8 rounded-full bg-white">
                <img src={content.author.avatar} alt="Avatar Image" />
              </div>
            </div>

            <p className="font-medium text-white">By {content.author.name}</p>
          </div>

          <p className=" text-white opacity-80">
            {format(parseISO(createdAt), "MMMM do',' yyyy")}
          </p>
        </div>

        <div className="divider m-0"></div>

        <div className="relative xs:h-52 md:h-96 w-full max-w-screen-lg m-auto rounded-2xl overflow-hidden">
          <img src={content.image.url} className="w-full h-full object-cover" />
        </div>

        <h1 className="text-white font-bold text-4xl tracking-tight">
          {entry.content.title}
        </h1>

        <h2 className="text-base text-white opacity-80 line-clamp-6 mb-4">
          {entry.content.abstract}
        </h2>

        <article className="text-justify mx-auto w-full text-white">
          <ReactMarkdown>{entry.content.body}</ReactMarkdown>
        </article>
      </div>
    </>
  );
};
