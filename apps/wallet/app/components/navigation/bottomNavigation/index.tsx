import { useRouter } from "next/router";
import { IconContext } from "react-icons";
import React, { FC } from "react";

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
  loading?: boolean;
  route?: string;
  back?: boolean;
  onClick?: (n: BottomNavigationItem) => void;
  disabled?: boolean;
  hideLabel?: boolean;
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
      <div className="btm-nav max-w-[768px] mx-auto print:hidden">
        {nav.map((n) => {
          const active = router.route === n.route ? "active" : "";
          if (n.route) {
            router.prefetch(n.route);
          }
          const btnColor = n.color
            ? `rounded-lg btn-${n.color}`
            : "bg-transparent border-0";

          const loading = n.loading ? "animate-pulse" : "";
          return (
            <>
              <button
                key={"nav-" + n.label}
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
            </>
          );
        })}
      </div>
    </IconContext.Provider>
  );
};
