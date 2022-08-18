import { Glasscard } from "@/app/components/cards/glasscard";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { RiUserAddLine, RiUserReceivedLine } from "react-icons/ri";
import { AttentionSeeker } from "react-awesome-reveal";

export const AccountSetup = () => {
  const router = useRouter();

  const handleCardClick = (route: string) => async (_: MouseEvent) => {
    await router.push(`/account/${route}`);
  };

  return (
    <div className="flex justify-center items-center h-[75vh]">
      <div className="flex flex-col md:flex-row">
        <Glasscard
          className="w-80"
          icon={
            <AttentionSeeker effect="tada">
              <RiUserReceivedLine size={32} />
            </AttentionSeeker>
          }
          title="Import Account"
          text="Choose this if you have an account already, and you want to import using the seed"
          onClick={handleCardClick("import")}
        />
        <Glasscard
          className="mt-8 md:mt-0 md:ml-8 w-80"
          icon={
            <AttentionSeeker effect="tada" delay={500}>
              <RiUserAddLine size={32} />
            </AttentionSeeker>
          }
          title="New Account"
          text="Choose this if you have no Signum account and you want to create one"
          onClick={handleCardClick("new")}
        />
      </div>
    </div>
  );
};
