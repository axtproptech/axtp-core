const fromQuantity = (qnt: string, decimals: number) =>
  (parseInt(qnt) / 1 ** decimals).toString(10);

export const toStableCoinAmount = (qnt: string) => fromQuantity(qnt, 2);
export const toPoolShareAmount = (qnt: string) => fromQuantity(qnt, 0);
