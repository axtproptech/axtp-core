import Link from "next/link";
import format from "date-fns/format";
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

export const EntryCard = ({ entry }) => {
  const { id, createdAt, tags, content } = entry;

  return (
    <Link href={"/exclusive/blog/" + id} passHref>
      <a className="group flex flex-col items-start justify-start xs:w-full md:w-1/2 px-4 mb-12 gap-1">
        <div className="relative w-full mb-2 aspect-[2.25/1] border-opacity-10 rounded-xl overflow-hidden group-hover:shadow-md group-hover:shadow-yellow-100 transition-all">
          <img
            src={content.image.url}
            alt={content.image.title}
            className="object-cover transition-transform group-hover:scale-[1.05] absolute h-full w-full inset-0"
          />
        </div>

        <span className="text-slate-300 text-sm"> {tags.join(" ")} </span>

        <h4 className="text-white font-bold xs:text-xl md:text-2xl group-hover:opacity-80 tracking-tight">
          {content.title}
        </h4>

        <p className="text-base text-white opacity-80 line-clamp-2 mb-2">
          {content.abstract}
        </p>

        <div className="w-full flex items-center justify-start gap-2">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src={content.author.avatar} alt="Author Avatar" />
            </div>
          </div>

          <p className="font-medium text-sm text-white opacity-80">
            {content.author.name} /{" "}
            {format(parseISO(createdAt), "MMMM do',' yyyy")}
          </p>
        </div>
      </a>
    </Link>
  );
};
