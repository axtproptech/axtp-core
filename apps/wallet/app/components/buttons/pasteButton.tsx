import { Button } from "react-daisyui";
import { RiClipboardFill } from "react-icons/ri";
import { useNotification } from "@/app/hooks/useNotification";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface Props {
  onText: (text: string) => void;
  disabled?: boolean;
}
export const PasteButton: FC<Props> = ({ onText, disabled = false }) => {
  const { t } = useTranslation();
  const { showWarning } = useNotification();

  const handleOnCLick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onText(text);
      }
    } catch (e) {
      showWarning(t("paste_clipboard_failure"));
    }
  };

  return (
    <Button
      color="secondary"
      onClick={handleOnCLick}
      disabled={disabled}
      startIcon={<RiClipboardFill />}
    >
      {t("paste")}
    </Button>
  );
};
