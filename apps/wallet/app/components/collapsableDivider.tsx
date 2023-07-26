import { RiArrowUpSLine } from "react-icons/ri";

interface Props {
  text: string;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const CollapsableDivider = ({
  isCollapsed,
  onCollapse,
  text,
}: Props) => {
  return (
    <div className="relative">
      <div className="divider">{text}</div>
      <div
        className="absolute right-4 top-[-8px]"
        onClick={() => onCollapse(!isCollapsed)}
      >
        <RiArrowUpSLine
          className={`bg-black rounded-full border border-primary-content border-solid p-1 ${
            isCollapsed ? "rotate-180" : "rotate-0"
          } transition-transform duration-300`}
          size={32}
        />
      </div>
    </div>
  );
};
