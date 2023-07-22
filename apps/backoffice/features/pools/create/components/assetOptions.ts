import { SelectOption } from "@/app/components/inputs";

export const AcquisitionStatusOptions: SelectOption[] = [
  { value: 0, label: "In Acquisition" },
  { value: 1, label: "Renting" },
  { value: 2, label: "Rehab (Section 8)" },
  { value: 3, label: "Maintenance" },
  { value: 4, label: "Sold" },
  { value: 5, label: "Lost" },
];

export const AcquisitionProgressOptions: SelectOption[] = [
  { value: 0, label: "Paid" },
  { value: 1, label: "Cert. Received" },
  { value: 2, label: "Notified" },
  { value: 3, label: "Acquired" },
  { value: 4, label: "Recovered" },
];
