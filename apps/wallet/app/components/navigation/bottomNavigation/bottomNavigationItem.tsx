export interface BottomNavigationItem {
  icon: any;
  label: string;
  type?: "button" | "submit";
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
