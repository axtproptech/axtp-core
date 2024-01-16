import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { CSSProperties, useMemo, useState } from "react";
import { formatDate } from "@/app/formatDate";
import { PaddingSize } from "@/features/account/transactions/transactionItem/transactionItemCard";
import { RewardItemData } from "@/types/rewardItemData";

interface Props {
  style: CSSProperties;
  data: RewardItemData[];
  index: number;
}

export const RewardItemCard = ({ style, data, index }: Props) => {
  const { locale } = useRouter();
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const rewardItem = data[index];

  return (
    <a
      href={rewardItem.url}
      rel="noreferrer"
      target="_blank"
      className="hover:!cursor-zoom-in"
    >
      <div
        className="card md:card-side glass"
        style={{
          ...style,
          // @ts-ignore
          top: style.top + PaddingSize,
          // @ts-ignore
          height: style.height - PaddingSize,
        }}
      >
        <figure className="relative md:w-1/2">
          <div className="absolute top-2 left-2 text-xs">
            {formatDate({ date: rewardItem.received, locale, withTime: false })}
          </div>
          <img
            src={rewardItem.imageUrl}
            alt={rewardItem.title}
            onLoad={() => setIsLoadingImage(false)}
          />
          {isLoadingImage && (
            <div className="absolute top-0 left-0 w-full h-full bg-base-100 opacity-80 animate-pulse" />
          )}
        </figure>
        <div className="card-body p-4 gap-0 md:max-w-1/2 md:w-1/2 hidden md:flex">
          <div className="flex flex-col justify-center">
            <h2 className="card-title m-auto">{rewardItem.title}</h2>
          </div>
          <p className="text-xs text-amber-100">{rewardItem.description}</p>
          <div>
            <div className="flex flex-row justify-between text-xs my-2">
              {rewardItem.attributes.map((a) => (
                <AttributeItem
                  key={`${rewardItem.nftId}-${a.key}`}
                  k={a.key}
                  v={a.value}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

const AttributeItem = ({ k, v }: { k: string; v: string }) => (
  <div className="uppercase bg-base-100 py-1 px-4 rounded-badge text-center">{`${k}  ${v}`}</div>
);
