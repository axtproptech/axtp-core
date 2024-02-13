import { formatCpfCnpj } from "@/app/formatCpfCnpj";

interface Props {
  cpfCnpj: string;
}
export const CpfCnpj = ({ cpfCnpj }: Props) => {
  return formatCpfCnpj(cpfCnpj);
};
