import { useRouter } from "next/router";
import { IconContext } from "react-icons";
import { FC } from "react";

export interface BottomNavigationItem {
  icon: any;
  route?: string;
  back?: boolean;
  onClick?: (n: BottomNavigationItem) => void;
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
        {nav.map((n, index) => (
          <button
            key={index}
            onClick={() => handleOnClick(n)}
            className={router.route === n.route ? "active" : ""}
          >
            {n.icon}
          </button>
        ))}
      </div>
    </IconContext.Provider>
  );
};
