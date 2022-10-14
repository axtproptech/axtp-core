export interface Address {
  id: number;
  createdAt: string;
  customerId: number;
  type: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  city: string;
  postCodeZip: string;
  state: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
}
