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
    <div className="w-full my-2">
      <Button color="secondary" onClick={handleOnCLick} disabled={disabled}>
        <RiClipboardFill className="mr-2" />
        {t("paste")}
      </Button>
    </div>
  );
};
