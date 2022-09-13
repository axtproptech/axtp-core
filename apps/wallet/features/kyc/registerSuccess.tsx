import { FC } from "react";
import { CustomerData } from "@/types/customerData";
import { AttentionSeeker } from "react-awesome-reveal";
import { RiCheckboxCircleLine } from "react-icons/ri";

interface Props {
  customer: CustomerData;
}

export const RegisterSuccess: FC<Props> = ({ customer }) => {
  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
      <section>
        <h1>Test</h1>
        <h2>Registered Successfully</h2>
      </section>
      <section className="w-[75%] text-justify border border-base-content/50 px-4 py-2 rounded relative mx-auto">
        <div className="form-control w-full flex flex-row justify-center items-center py-2">
          <AttentionSeeker effect="tada" className="text-center">
            <RiCheckboxCircleLine size={92} className="w-full" />
          </AttentionSeeker>
        </div>
      </section>
    </div>
  );
};
