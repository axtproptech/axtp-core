import { Glasscard } from "@/app/components/cards/glasscard";
import { useRouter } from "next/router";
import { MouseEvent } from "react";

export const AccountSetup = () => {
  const router = useRouter();

  const handleCardClick = (route: string) => async (_: MouseEvent) => {
    await router.push(`/account/${route}`);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row w-full justify-center items-center h-[75vh]">
        <Glasscard
          className="w-80"
          title="Import Account"
          text="Choose this if you have an account already, and you want to import using the seed"
          onClick={handleCardClick("import")}
        />
        <Glasscard
          className="mt-8 md:mt-0 md:ml-8 w-80"
          title="New Account"
          text="Choose this if you have no Signum account and you want to create one"
          onClick={handleCardClick("new")}
        />
      </div>
    </>
  );
};
