import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";

export interface OnStepChangeArgs {
  steps: number;
  currentStep: number;
  bottomNav: BottomNavigationItem[];
}
