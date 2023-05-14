import { useEffect, useState } from "react";
import { Icon } from "react-icons-kit";
import { ic_account_balance_wallet } from "react-icons-kit/md/ic_account_balance_wallet";
import { getCompactNumberFormatter } from "common/numbers";

import hashicon from "hashicon";
import Button from "common/components/Button";

const WalletUrl = process.env.NEXT_PUBLIC_WALLET_URL || "";

export const PoolInvestmentCard = ({ pool }) => {
  const {
    nominalLiquidity,
    grossMarketValue,
    token,
    maxShareQuantity,
    poolId,
    description,
  } = pool;

  const [hashIconUrl, setHashIconUrl] = useState("");

  useEffect(() => {
    if (document !== undefined) {
      // hashicon does not work nicely on server side
      setHashIconUrl(hashicon(poolId, { size: 64 }).toDataURL());
    }
  }, [poolId]);

  const compactNumber = getCompactNumberFormatter();

  const performance =
    nominalLiquidity > 0
      ? (grossMarketValue / nominalLiquidity) * 100 - 100
      : 0;
  const remainingTokens = maxShareQuantity - token.supply;

  return (
    <div
      className="w-full max-w-md rounded-3xl p-4 bg-gray-900 mx-auto shadow-lg bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 mb-4 overflow-hidden border-2 border-yellow-200"
      style={{
        boxShadow: "rgba(255, 200, 29, 0.15) 0px 4px 24px",
      }}
    >
      <div
        className="w-full h-40 bg-center bg-no-repeat bg-cover rounded-2xl mb-4"
        style={{
          backgroundImage: "url(/assets/exclusive/card-icon-TAXTP001.webp)",
        }}
      ></div>

      <div className="flex w-full flex-row items-start gap-4 mb-2">
        <p className="text-sm text-justify text-white mb-2">
          <span className="opacity-100 font-black">
            {token.name.toUpperCase()}
          </span>
          {" - "}
          <span className="opacity-80"> {description}</span>
        </p>
      </div>

      <div
        className="flex w-full flex-row items-center justify-center px-2 border-y-2 mb-2"
        style={{
          borderColor: "#3D3D3D",
        }}
      >
        <div className="flex flex-1 flex-col justify-center text-center py-2 gap-1">
          <p className="text-yellow-500 text-2xl font-bold ">
            {compactNumber.format(grossMarketValue)}
          </p>
          <p className="text-white text-xl opacity-80">Gross Market Value</p>
        </div>

        <div
          className="flex flex-1 flex-col justify-center text-center py-2 gap-1 border-l-2"
          style={{
            borderColor: "#3D3D3D",
          }}
        >
          <p className="text-yellow-500 text-2xl font-bold ">
            {performance.toFixed(2)}%
          </p>

          <p className="text-white text-xl opacity-80">Performance</p>
        </div>
      </div>

      <p className="text-red-500 text-center mb-2 font-bold">
        {`${remainingTokens} tokens restantes`}
      </p>

      <div className="flex w-full flex-col items-center justify-center gap-4 mb-2">
        <a href={WalletUrl} rel="noopener noreferrer" target="_blank">
          <Button
            icon={<Icon icon={ic_account_balance_wallet} />}
            iconPosition="left"
            disabled={false}
            variant="extenfabvdedFab"
            title="Invista já!"
          />
        </a>
        <a
          className="text-sm text-yellow-100 gap-4 mb-2 text-center bg-gray-800 rounded-md px-2 py-1 hover:brightness-110"
          href={`${WalletUrl}/kyc/registry`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Clique aqui se você ainda não abriu sua carteira
        </a>
      </div>
    </div>
  );
};
