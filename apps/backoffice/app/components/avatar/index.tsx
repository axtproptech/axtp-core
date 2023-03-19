import { FC, useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import styles from "./avatar.module.css";
// @ts-ignore
import hashicon from "hashicon";
import { Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";

interface Props {
  alt: string;
}

export const Avatar: FC<Props> = ({ alt }) => {
  const theme = useTheme();
  const { accountId } = useAccount();
  const iconUrl = useMemo(() => {
    if (!accountId) return "";
    return hashicon(accountId, { size: 32 }).toDataURL();
  }, [accountId]);

  return (
    <div
      className={styles.avatarContainer}
      style={{
        backgroundColor: accountId
          ? theme.palette.success.main
          : theme.palette.warning.main,
      }}
    >
      {iconUrl ? (
        <img className={styles.avatarImage} src={iconUrl} alt={alt} />
      ) : (
        <Box className={styles.avatarText}>
          <Typography
            className={styles.avatarTextInner}
            variant="subtitle2"
            color="grey.900"
            sx={{ opacity: 0.6 }}
          >
            {alt.substring(0, 2).toUpperCase()}
          </Typography>
        </Box>
      )}
    </div>
  );
};
