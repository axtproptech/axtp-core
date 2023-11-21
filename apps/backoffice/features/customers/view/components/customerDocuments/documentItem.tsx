import { LabeledTextField } from "@/app/components/labeledTextField";
import { toDateStr } from "@/app/toDateStr";
import { DownloadButton } from "@/app/components/buttons/downloadButton";
import { Document } from "@/bff/types/customerFullResponse";

interface Props {
  document: Document;
}

export const DocumentItem = ({ document }: Props) => {
  return (
    <>
      <LabeledTextField label="Type" text={document.type} />
      <LabeledTextField
        label="Upload Date"
        text={toDateStr(new Date(document.createdAt))}
      />
      <DownloadButton url={document.url} />
    </>
  );
};
