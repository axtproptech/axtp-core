import { Icon } from "react-icons-kit";
import { ic_clear } from "react-icons-kit/md/ic_clear";

export const FilterHeader = ({ tag, onReset }) => {
  if (!tag) return null;

  return (
    <section className="flex flex-row justify-end items-center gap-x-1">
      <button className="btn btn-xs">{tag}</button>
      <div
        className="text-slate-100 cursor-pointer tooltip"
        data-tip="Reset Filter"
      >
        <Icon icon={ic_clear} onClick={onReset} size={36} />
      </div>
    </section>
  );
};
