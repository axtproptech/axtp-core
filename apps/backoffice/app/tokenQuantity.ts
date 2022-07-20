export const fromQuantity = (qnt: string | number, decimals: number) => {
  const int = typeof qnt === "string" ? parseInt(qnt) : qnt;
  return (int / 10 ** decimals).toString(10);
};

export const toQuantity = (qnt: string | number, decimals: number) => {
  const float = typeof qnt === "string" ? parseFloat(qnt) : qnt;
  return float * 10 ** decimals;
};

export const toStableCoinAmount = (qnt: string | number) =>
  fromQuantity(qnt, 2);
export const toStableCoinQuantity = (qnt: string | number) =>
  toQuantity(qnt, 2);

export const toPoolShareAmount = (qnt: string | number) => fromQuantity(qnt, 0);
export const toPoolShareQuantity = (qnt: string | number) =>
  fromQuantity(qnt, 0);
