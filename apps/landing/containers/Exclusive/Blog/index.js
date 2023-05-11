import { EntryCard } from "./components/EntryCard";

const categories = [
  { tag: "everything", title: "Everything" },
  { tag: "new", title: "News" },
  { tag: "company", title: "Company" },
  { tag: "guide", title: "Guides" },
  { tag: "community", title: "Community" },
];

export const BlogPage = ({ articles }) => {
  return (
    <div className="flex flex-col pt-32 mb-24 max-w-6xl px-4 mx-auto gap-4">
      <div className="flex justify-start items-start flex-wrap">
        {articles.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};
