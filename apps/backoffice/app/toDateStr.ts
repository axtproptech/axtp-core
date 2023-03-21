export const toDateStr = (date: Date) => {
  const d = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
  return d.toLocaleDateString();
};
