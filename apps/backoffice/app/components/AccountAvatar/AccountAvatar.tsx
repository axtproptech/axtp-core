import { useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import styles from "./AccountAvatar.module.css";
// @ts-ignore
import hashicon from "hashicon";

export const AccountAvatar = () => {
  const { accountId } = useAccount();
  const iconUrl = useMemo(() => {
    if (!accountId) return "";
    return hashicon(accountId, { size: 36 }).toDataURL();
  }, [accountId]);

  return (
    <div className={styles.avatarContainer}>
      <img
        className={styles.avatarImage}
        src={iconUrl}
        alt="collector-avatar"
      />
    </div>
  );
};
