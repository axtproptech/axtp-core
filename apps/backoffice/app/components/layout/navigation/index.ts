import { dashboard } from "./dashboard";
import { pools } from "./pools";
import { liquidity } from "./liquidity";
import { customers } from "./customers";
import { payments } from "./payments";
import { withdrawals } from "./withdrawals";

export const navItems = [
  dashboard,
  payments,
  withdrawals,
  customers,
  pools,
  liquidity,
];
