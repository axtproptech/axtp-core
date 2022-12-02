import { Button } from "react-daisyui";
import { RiClipboardLine } from "react-icons/ri";
import { useNotification } from "@/app/hooks/useNotification";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface Props {
  text: string;
}
export const CopyButton: FC<Props> = ({ text }) => {
  const { t } = useTranslation();
  const { showInfo, showWarning } = useNotification();

  const handleOnCLick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showInfo(t("copy_clipboard_success"));
    } catch (e) {
      showWarning(t("copy_clipboard_failure"));
    }
  };

  return (
    <div className="w-full my-2">
      <Button color="secondary" onClick={handleOnCLick}>
        <RiClipboardLine className="mr-2" />
        {t("copy")}
      </Button>
    </div>
  );
};
