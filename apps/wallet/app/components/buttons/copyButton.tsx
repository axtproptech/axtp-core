import { Button } from "react-daisyui";
import { RiClipboardLine } from "react-icons/ri";
import { useNotification } from "@/app/hooks/useNotification";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface Props {
  textToCopy: string;
  disabled?: boolean;
}
export const CopyButton: FC<Props> = ({ textToCopy, disabled = false }) => {
  const { t } = useTranslation();
  const { showInfo, showWarning } = useNotification();

  const handleOnCLick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      showInfo(t("copy_clipboard_success"));
    } catch (e) {
      showWarning(t("copy_clipboard_failure"));
    }
  };

  return (
    <div className="w-full my-2">
      <Button
        className="w-full"
        type="button"
        color="accent"
        onClick={handleOnCLick}
        disabled={disabled}
        startIcon={<RiClipboardLine />}
      >
        {t("copy")}
      </Button>
    </div>
  );
};
