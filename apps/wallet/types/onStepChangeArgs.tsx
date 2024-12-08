import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation/bottomNavigationItem";

export interface OnStepChangeArgs {
  steps: number;
  currentStep: number;
  bottomNav: BottomNavigationItem[];
}
