import { off } from "process";

export type CustomerFilterType = {
  name: string;
  email: string | undefined;
  cpf: string | undefined;
  verified: boolean | undefined;
  blocked: boolean | undefined;
  active: boolean | undefined;
  invited: boolean | undefined;
  brazilian: boolean | undefined;
  allStatus?: boolean;
};

export type PaginationModelType = {
  page: number;
  pageSize: number;
  offset?: number;
};
