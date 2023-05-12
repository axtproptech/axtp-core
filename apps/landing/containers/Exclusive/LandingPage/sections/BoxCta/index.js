import { Icon } from "react-icons-kit";
import { ic_account_balance_wallet } from "react-icons-kit/md/ic_account_balance_wallet";
import { ic_contact_support_outline } from "react-icons-kit/md/ic_contact_support_outline";

import Link from "next/link";
import Button from "common/components/Button";

export const BoxCta = () => {
  return (
    <div
      className="relative flex flex-col justify-center items-center w-full max-w-2xl rounded-2xl px-4 py-20 mx-auto shadow-lg mb-8 "
      style={{
        border: "1px #3D3D3D solid",
        background:
          "linear-gradient(327.21deg, rgba(255, 169, 42, 0.24) 3.65%, #222222 40.32%), linear-gradient(245.93deg, rgba(255, 179, 67, 0.16) 0%, rgba(255, 179, 67, 0.1) 36.63%), linear-gradient(147.6deg, rgba(58, 19, 255, 0) 29.79%, rgba(98, 19, 255, 0.01) 85.72%), #13111C",
      }}
    >
      <p className="text-white text-xl opacity-80 mb-2 text-center">
        Você quer perder a oportunidade de fazer seu patrimônio crescer?
      </p>

      <p className="text-white text-3xl font-bold mb-4 text-center">
        Entre no mundo dos Ativos Digitais agora mesmo!
      </p>

      <div className="flex w-full flex-row items-center justify-center gap-4 mb-2">
        <a
          href={process.env.NEXT_PUBLIC_WALLET_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            icon={<Icon icon={ic_account_balance_wallet} />}
            iconPosition="left"
            disabled={false}
            variant="extenfabvdedFab"
            title="Crie sua carteira!"
          />
        </a>

        <Link href="mailto:info@axtp.com.br" passHref>
          <Button
            icon={<Icon icon={ic_contact_support_outline} />}
            iconPosition="left"
            disabled={false}
            variant="outlined"
            colors="warning"
            title="Contato"
            onClick={null}
          />
        </Link>
      </div>
    </div>
  );
};
