const EmailPattern = new RegExp(
  "^[a-z0-9.!#$&'*+\\/=?^_{}~-]+@[a-z0-9?(?:.a-z0-9?)]*$"
);
const PhonePattern = new RegExp("^\\+[1-9][0-9]\\d{1,14}$");
const CpfPattern = new RegExp("^[0-9]{11}$");
const CnpjPattern = new RegExp("^[0-9]{14}$");
const RandomPattern = new RegExp(
  "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
);

export function validatePixKey(pixKey: string) {
  return (
    EmailPattern.test(pixKey) ||
    PhonePattern.test(pixKey) ||
    CpfPattern.test(pixKey) ||
    CnpjPattern.test(pixKey) ||
    RandomPattern.test(pixKey)
  );
}
