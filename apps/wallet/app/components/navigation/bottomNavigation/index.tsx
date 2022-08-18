import { useRouter } from "next/router";
import { IconContext } from "react-icons";
import { FC } from "react";

export interface BottomNavigationItem {
  icon: any;
  label: string;
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "info"
    | "success"
    | "warning"
    | "error";
  route?: string;
  back?: boolean;
  onClick?: (n: BottomNavigationItem) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

interface Props {
  nav: BottomNavigationItem[];
}

export const BottomNavigation: FC<Props> = ({ nav }) => {
  const router = useRouter();

  const handleOnClick = (n: BottomNavigationItem) => {
    if (n.back) {
      router.back();
      return;
    }

    n.onClick && n.onClick(n);
    n.route && router.push(n.route);
  };

  return (
    <IconContext.Provider value={{ size: "1.5em" }}>
      <div className="btm-nav max-w-[768px] mx-auto">
        {nav.map((n, index) => {
          const active = router.route === n.route ? "active" : "";
          const btnColor = n.color ? `rounded-lg btn-${n.color}` : "";
          return (
            <button
              key={index}
              onClick={() => handleOnClick(n)}
              className={`${btnColor} ${active}`}
              disabled={n.disabled || false}
              aria-label={n.label}
            >
              {n.icon}
            </button>
          );
        })}
      </div>
    </IconContext.Provider>
  );
};
