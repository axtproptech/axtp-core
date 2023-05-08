import Link from "next/link";
import format from "date-fns/format";

const EntryCard = ({
  id,
  tag,
  cover,
  title,
  shortDescription,
  author,
  authorAvatar,
  date,
}) => (
  <Link href={"/exclusive/blog/" + id} passHref>
    <a className="group flex flex-col items-start justify-start xs:w-full md:w-1/2 px-4 mb-12 gap-1">
      <div className="relative w-full mb-2 aspect-[2.25/1] border-opacity-10 rounded-xl overflow-hidden group-hover:shadow-md group-hover:shadow-yellow-100 transition-all">
        <img
          src={cover}
          atl="Image"
          className="object-cover transition-transform group-hover:scale-[1.05] absolute h-full w-full inset-0"
        />
      </div>

      <span className="text-slate-300 text-sm"> {tag} </span>

      <h4 className="text-white font-bold xs:text-xl md:text-2xl group-hover:opacity-80 tracking-tight">
        {title}
      </h4>

      <p className="text-base text-white opacity-80 line-clamp-2 mb-2">
        {shortDescription}
      </p>

      <div className="w-full flex items-center justify-start gap-2">
        <div className="avatar">
          <div className="w-8 rounded-full">
            <img src={authorAvatar} />
          </div>
        </div>

        <p className="font-medium text-sm text-white opacity-80">
          {author} / {format(date, "MMMM do',' yyyy")}
        </p>
      </div>
    </a>
  </Link>
);

export default EntryCard;
