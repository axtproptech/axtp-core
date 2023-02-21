import { ApprovalStatus } from "@/types/approvalStatus";

export function isApprovalRequested(status: ApprovalStatus) {
  return parseInt(status.quantity, 10) > 0;
}
