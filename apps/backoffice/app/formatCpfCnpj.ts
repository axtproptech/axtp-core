export function formatCpfCnpj(cpfCnpj: string) {
  const pruned = cpfCnpj.replace(/\D/g, "");
  return pruned.length === 11
    ? pruned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4")
    : pruned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
}
