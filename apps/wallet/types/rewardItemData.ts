export interface RewardAttribute {
  key: string;
  value: string;
}

export interface RewardItemData {
  attributes: RewardAttribute[];
  title: string;
  description: string;
  edition: number;
  url: string;
  nftId: string;
  imageUrl: string;
  received: string; // ISO-DATE
  ownerId: string;
}
