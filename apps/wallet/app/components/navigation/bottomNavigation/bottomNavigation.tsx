import React from "react";
import { useRouter } from "next/router";
import { BottomNavigationItem } from "./bottomNavigationItem";
import { IconContext } from "react-icons";
import { useBottomNavigation } from "./bottomNavigationContext";

interface Props {
  nav?: BottomNavigationItem[];
}

export const BottomNavigation = ({ nav }: Props) => {
  const router = useRouter();
  const { navItems } = useBottomNavigation();
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
      <div className="btm-nav max-w-[768px] mx-auto print:hidden">
        {navItems.map((n) => {
          const active = router.route === n.route ? "active" : "";
          if (n.route) {
            router.prefetch(n.route);
          }
          const btnColor = n.color
            ? `rounded-lg btn-${n.color}`
            : "bg-transparent border-0";

          const loading = n.loading ? "animate-pulse" : "";
          return (
            <button
              key={"nav-" + n.label}
              type={n.type || "submit"}
              onClick={() => handleOnClick(n)}
              className={`flex flex-col items-center flex-shrink btn h-full ${btnColor} ${active} ${loading}`}
              disabled={n.disabled || n.loading || false}
              aria-label={n.label}
            >
              {React.cloneElement(n.icon, { size: 28 })}
              {!n.hideLabel && (
                <small className="text-[10px]">{n.label.toUpperCase()}</small>
              )}
            </button>
          );
        })}
      </div>
    </IconContext.Provider>
  );
};
