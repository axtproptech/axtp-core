export type StatusVariants = "done" | "next" | "open" | "lost";

export const AcquisitionStatus: Record<number, string> = {
  0: "asset_s_in_acquisition",
  1: "asset_s_renting",
  2: "asset_s_rehab",
  3: "asset_s_maintenance",
  4: "asset_s_sold",
  5: "asset_s_lost",
};

export const AcquisitionProgress: Record<number, string> = {
  0: "asset_p_paid",
  1: "asset_p_cert",
  2: "asset_p_notified",
  3: "asset_p_acquired",
  4: "asset_p_recovered",
};

export function getProgressState(
  acquisitionProgress: number
): { v: StatusVariants; l: string }[] {
  switch (acquisitionProgress) {
    case 0:
      return [
        { v: "done", l: AcquisitionProgress[0] },
        { v: "next", l: AcquisitionProgress[1] },
        { v: "open", l: AcquisitionProgress[2] },
        { v: "open", l: AcquisitionProgress[3] },
      ];
    case 1:
      return [
        { v: "done", l: AcquisitionProgress[0] },
        { v: "done", l: AcquisitionProgress[1] },
        { v: "next", l: AcquisitionProgress[2] },
        { v: "open", l: AcquisitionProgress[3] },
      ];
    case 2:
      return [
        { v: "done", l: AcquisitionProgress[0] },
        { v: "done", l: AcquisitionProgress[1] },
        { v: "done", l: AcquisitionProgress[2] },
        { v: "next", l: AcquisitionProgress[3] },
      ];
    case 3:
      return [
        { v: "done", l: AcquisitionProgress[0] },
        { v: "done", l: AcquisitionProgress[1] },
        { v: "done", l: AcquisitionProgress[2] },
        { v: "done", l: AcquisitionProgress[3] },
      ];
    case 4:
      return [
        { v: "done", l: AcquisitionProgress[0] },
        { v: "done", l: AcquisitionProgress[1] },
        { v: "done", l: AcquisitionProgress[2] },
        { v: "lost", l: AcquisitionProgress[4] },
      ];
    default:
      return [
        { v: "open", l: AcquisitionProgress[0] },
        { v: "open", l: AcquisitionProgress[1] },
        { v: "open", l: AcquisitionProgress[2] },
        { v: "open", l: AcquisitionProgress[3] },
      ];
  }
}
