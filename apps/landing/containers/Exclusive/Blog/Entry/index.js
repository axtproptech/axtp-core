import { useEffect, useState } from "react";
import { Icon } from "react-icons-kit";
import { ic_keyboard_arrow_left_twotone } from "react-icons-kit/md/ic_keyboard_arrow_left_twotone";

import Link from "next/link";
import format from "date-fns/format";
import ReactMarkdown from "react-markdown";
import Button from "common/components/Button";
import { parseISO } from "date-fns";

// const article = {
//   id: "",
//   createdAt: "",
//   tags: [],
//   content: {
//     title: " Greetings, my fellow earthlings!",
//     subtitle: "The idea of owning a unicorn 🦄",
//     image: {
//       url: "",
//       title: "",
//       description: "",
//     }, // from Asset
//     abstract:
//       "The article discusses the challenges of owning a pet unicorn, from their messy and demanding nature to their unpredictable mood swings and the potential hazards posed by their horn. While the idea of owning a unicorn may seem appealing, the reality is far from glamorous. The article concludes by suggesting that it may be better to stick with more conventional pets, such as goldfish or hamsters.",
//     body: "\nGreetings, my fellow earthlings!\n\nHave you ever wondered what it would be like to have a pet unicorn? Well, I have! And let me tell you, it's not as glamorous as it seems.\n\nFirst of all, unicorns are incredibly messy creatures. They shed glitter everywhere and their rainbow droppings are a nightmare to clean up. Not to mention the fact that they constantly demand to be fed skittles and cotton candy. It's a wonder they don't get diabetes.\n\nAnd don't even get me started on their mood swings. One minute they're prancing around the meadow, spreading joy and happiness wherever they go, and the next minute they're bucking and snorting like a wild stallion on steroids. It's like living with a hormonal teenager, but with hooves.\n\nAnd let's not forget about the unicorn horn. Sure, it looks pretty and magical, but it's a health hazard waiting to happen. I can't tell you how many times I've accidentally poked myself in the eye while trying to pet my unicorn's forehead. And don't even get me started on the time my unicorn got stuck in a doorframe because its horn was too big. Talk about a unicorn-sized headache.\n\nSo, in conclusion, while owning a pet unicorn may seem like a dream come true, it's really just a glittery, rainbow-colored nightmare. Stick with a goldfish or a hamster. They may not be as magical, but at least they won't leave skittles all over your carpet.",
//     author: {
//       name: "",
//       avatar: "",
//     },
//   },
// };
//

// TODO: Add a banner image
export const BlogEntryPage = ({ entry }) => {
  const { createdAt, tags, content } = entry;

  return (
    <div className="flex flex-col pt-32 mb-24 max-w-4xl px-4 mx-auto gap-4">
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
          Company News
        </div>

        <div className="flex items-center justify-start gap-2">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src={content.author.avatar} alt="Avatar Image" />
            </div>
          </div>

          <p className="font-medium text-sm text-white opacity-80">
            {content.author.name} /{" "}
            {format(parseISO(createdAt), "MMMM do',' yyyy")}
          </p>
        </div>
      </div>

      <div className="divider m-0"></div>

      <h1 className="text-white font-bold text-4xl tracking-tight">
        {entry.content.title}
      </h1>

      <h2 className="text-sm text-white opacity-80 line-clamp-6 mb-4">
        {entry.content.abstract}
      </h2>

      <article className="text-justify mx-auto w-full text-white">
        <ReactMarkdown>{entry.content.body}</ReactMarkdown>
      </article>
    </div>
  );
};
