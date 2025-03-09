import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ChildrenProps } from "@/types/childrenProps";
import { BottomNavigationItem } from "./bottomNavigationItem";

export interface NavigationContextType {
  setNavItems: Dispatch<SetStateAction<BottomNavigationItem[]>>;
  navItems: BottomNavigationItem[];
}

const BottomNavigationContext = createContext<NavigationContextType>({
  navItems: [],
  setNavItems: () => {},
});

interface Props extends ChildrenProps {
  navItems: BottomNavigationItem[];
}

export const BottomNavigationProvider = ({
  children,
  navItems: _navItems,
}: Props) => {
  const [navItems, setNavItems] = useState<BottomNavigationItem[]>(_navItems);

  return (
    <BottomNavigationContext.Provider value={{ navItems, setNavItems }}>
      {children}
    </BottomNavigationContext.Provider>
  );
};

export const useBottomNavigation = () => useContext(BottomNavigationContext);
