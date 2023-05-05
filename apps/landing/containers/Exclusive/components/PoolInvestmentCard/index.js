import { Icon } from "react-icons-kit";
import { ic_account_balance_wallet } from "react-icons-kit/md/ic_account_balance_wallet";
import { ic_insert_link } from "react-icons-kit/md/ic_insert_link";

import Button from "common/components/Button";

const PoolInvestmentCard = () => {
  return (
    <div
      className="w-full max-w-md rounded-3xl p-4 bg-gray-900 mx-auto shadow-lg bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 mb-4 overflow-hidden border-2 border-yellow-200"
      style={{
        boxShadow: "rgba(255, 200, 29, 0.15) 0px 4px 24px",
      }}
    >
      <p className="text-yellow-500 font-black text-center mb-4">
        Real State Market
      </p>

      <div className="flex w-full flex-row items-center justify-center gap-4 mb-2">
        <img src="assets/exclusive/temporalAvatar.png" width={32} height={32} />
        <p className="text-2xl text-white font-bold">AXTP001</p>
      </div>

      <p className="text-center text-white opacity-80 mb-2">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since 2005
      </p>

      <div
        className="flex w-full flex-row items-center justify-center px-2 border-y-2 mb-2"
        style={{
          borderColor: "#3D3D3D",
        }}
      >
        <div className="flex flex-1 flex-col justify-center text-center py-2 gap-1">
          <p className="text-yellow-500 text-2xl font-bold ">900K</p>

          <p className="text-white text-xl opacity-80">Gross Market Value</p>
        </div>

        <div
          className="flex flex-1 flex-col justify-center text-center py-2 gap-1 border-l-2"
          style={{
            borderColor: "#3D3D3D",
          }}
        >
          <p className="text-yellow-500 text-2xl font-bold ">19.3%</p>

          <p className="text-white text-xl opacity-80">Performance</p>
        </div>
      </div>

      <p className="text-red-500 text-center mb-2 font-bold">
        88 remaining tokens
      </p>

      <div className="flex w-full flex-row items-center justify-center gap-4 mb-2">
        <Button
          icon={<Icon icon={ic_account_balance_wallet} />}
          iconPosition="left"
          disabled={false}
          variant="extenfabvdedFab"
          title="Invest Now"
          onClick={() => alert("Click now")}
        />

        <Button
          icon={<Icon icon={ic_insert_link} />}
          iconPosition="left"
          disabled={false}
          variant="extenfabvdedFab"
          colors="secondaryWithBg"
          title="Whitepaper"
          onClick={() => alert("Click now")}
        />
      </div>
    </div>
  );
};

export default PoolInvestmentCard;
