import { useRouter } from "next/router";
import { IconContext } from "react-icons";
import { FC } from "react";

export interface BottomNavigationItem {
  icon: any;
  route: string;
}

interface Props {
  nav: BottomNavigationItem[];
}

export const BottomNavigation: FC<Props> = ({ nav }) => {
  const router = useRouter();
  return (
    <IconContext.Provider value={{ size: "1.25em" }}>
      <div className="btm-nav">
        {nav.map((n, index) => (
          <button
            key={index}
            onClick={() => router.push(n.route || "/")}
            className={router.route === n.route ? "active" : ""}
          >
            <n.icon />
          </button>
        ))}
      </div>
    </IconContext.Provider>
  );
};
