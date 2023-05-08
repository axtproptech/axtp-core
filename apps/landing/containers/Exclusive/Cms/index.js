import { useEffect, useState } from "react";
import TagChip from "./components/TagChip";
import EntryCard from "./components/EntryCard";

const categories = [
  { tag: "everything", title: "Everything" },
  { tag: "new", title: "News" },
  { tag: "company", title: "Company" },
  { tag: "guide", title: "Guides" },
  { tag: "community", title: "Community" },
];

const CmsPage = () => {
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [canLoadMorePosts, setCanLoadMorePosts] = useState(false);

  const [tag, setTag] = useState("everything");
  const updateTag = (value) => {
    setTag(value);
  };

  const loadMoreEntries = () => alert("load more entries");

  // TODO: Delete this dummy use effect
  useEffect(() => {
    setCanLoadMorePosts(true);
  }, []);

  // TODO: Delete this and put dynamic data
  const dummyEntries = [
    {
      id: "5641as5dasdqw14q9dasd",
      tag: "Community",
      cover:
        "https://images.pexels.com/photos/681368/pexels-photo-681368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Announcing the new Investment Pool",
      shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five.",
      author: "Laura Ortega",
      authorAvatar:
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
      date: new Date(),
    },
  ];

  return (
    <div className="flex flex-col pt-32 mb-24 max-w-6xl px-4 mx-auto gap-4">
      <div className="flex justify-start items-center gap-4">
        {categories.map((category) => (
          <TagChip
            key={category.tag}
            isActive={tag === category.tag}
            title={category.title}
            onClick={() => updateTag(category.tag)}
          />
        ))}
      </div>

      <div className="flex justify-start items-start flex-wrap">
        {dummyEntries.map((entry) => (
          <EntryCard
            key={entry.id}
            id={entry.id}
            tag={entry.tag}
            cover={entry.cover}
            title={entry.title}
            shortDescription={entry.shortDescription}
            author={entry.author}
            authorAvatar={entry.authorAvatar}
            date={entry.date}
          />
        ))}
      </div>

      {canLoadMorePosts && (
        <button
          onClick={loadMoreEntries}
          disabled={isLoadingContent}
          className={`
          btn btn-outline capitalize ${isLoadingContent ? "loading" : ""}
          `}
        >
          Load More Posts
        </button>
      )}
    </div>
  );
};

export default CmsPage;
