import { Status } from "@/bff/types/status";

interface Props {
  status: Status;
}

export const Home: React.FC<Props> = ({ status }) => {
  return (
    <div className="my-5">
      <h1>Hallo</h1>
    </div>
  );
};
