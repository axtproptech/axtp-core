import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { RiDeleteBinLine } from "react-icons/ri";

interface Props {
  file: string;
  loaded: number;
  total: number;
  handleDelete: () => void;
}

export const FileChip = ({ file, loaded, total, handleDelete }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        className="flex justify-between text-center badge badge-lg w-full h-12"
        key={file}
      >
        <span className="w-32 truncate text-xs">{file}</span>

        <Button
          type="button"
          className="text-xs font-bold capitalize"
          color="error"
          onClick={handleDelete}
          startIcon={<RiDeleteBinLine />}
        >
          {t("delete")}
        </Button>
      </div>

      <progress
        className="progress progress-success w-full"
        value={loaded}
        max={total}
      />
    </div>
  );
};
