import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSystemTheme } from "@/app/getSystemTheme";
import { Config } from "@/app/config";
import { NavigationItem } from "@/types/navigationItem";
import { navItems } from "@/app/components/layout/navigation";
import { NavItem } from "@/app/components/layout/mainLayout/sidebar/menuList/navItem";

export interface SnackBarState {
  label: string;
  severity: "" | "error" | "warning" | "info" | "success";
}

export type ShareModalStatus = "site" | "NFT" | "collection" | "profile" | "";

export interface AppState {
  themeMode: "light" | "dark";
  isOpenWalletModal: boolean;
  isOpenWalletWrongNetworkModal: boolean;
  isOpenSignTransactionModal: boolean;
  snackBar: SnackBarState;
  nodeHost: string;
  isWalletConnected: boolean;
  isLeftDrawerOpened: boolean;
  // navItems: NavigationItem[];
}

const initialState: AppState = {
  themeMode: getSystemTheme(),
  isOpenWalletModal: false,
  isOpenWalletWrongNetworkModal: false,
  isOpenSignTransactionModal: false,
  snackBar: { label: "", severity: "" },
  nodeHost: Config.Signum.DefaultNode,
  isWalletConnected: false,
  isLeftDrawerOpened: false,
  // navItems,
};

interface AddNavItemArgs {
  path: string; // pools/creat-pool
  item: NavigationItem;
}

function findNavItem(item: NavigationItem, path: string[]): NavigationItem {
  let next = item;
  let part = path.pop();
  while (part) {
    if (next.id === part) {
      next = item;
    }
    if (next.type !== "item") {
      const childItem = next.children.find(({ id }) => id === part);
      if (childItem) {
        next = childItem;
      }
    }
    part = path.pop();
  }
  return item;
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.themeMode = action.payload;
    },
    setWalletModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenWalletModal = action.payload;
    },
    setWalletWrongNetworkModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenWalletWrongNetworkModal = action.payload;
    },
    setSignTransactionModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenSignTransactionModal = action.payload;
    },
    setSnackbar: (state, action: PayloadAction<SnackBarState>) => {
      state.snackBar = action.payload;
    },
    setNodeHost: (state, action: PayloadAction<string>) => {
      state.nodeHost = action.payload;
    },
    setIsWalletConnected: (state, action: PayloadAction<boolean>) => {
      state.isWalletConnected = action.payload;
    },
    setIsLeftDrawerOpened: (state, action: PayloadAction<boolean>) => {
      state.isLeftDrawerOpened = action.payload;
    },
    // addNavItem: (state, action: PayloadAction<AddNavItemArgs>) => {
    //   const {item, path} = action.payload;
    //   const parts = path.split('/')
    //   const firstPart = parts.pop()
    //   const root = state.navItems.find( ({id}) => id === firstPart)
    //   if(root){
    //     const found = findNavItem(root, parts)
    //     if(found && found.type !== 'item'){
    //       found.children.push(item)
    //     }
    //   }
    // },
  },
});

export const { actions } = appSlice;
