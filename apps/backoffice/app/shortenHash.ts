export function shortenHash(address: string, length = 16) {
  if (address.length <= length) return address;

  const halver = Math.ceil(length / 2);
  return (
    address.substring(0, halver) +
    "..." +
    address.substring(address.length - 1 - halver, address.length - 1)
  );
}
