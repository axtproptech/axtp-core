import { Http, HttpClientFactory } from "@signumjs/http";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { fileService } from "@/app/services/fileService";

interface CustomerUpdateAddressArgs {
  addressId: number;
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  postCodeZip?: string;
  state?: string;
}

interface UploadDocumentArgs {
  documentType: string;
  file: File;
  onProgress: (progress: { loaded: number; total: number }) => void;
}
export class CustomerInstanceService {
  private fileService = fileService;
  private http: Http;

  constructor(private cuid: string) {
    this.http = HttpClientFactory.createHttpClient(
      `/api/admin/customers/${cuid}`
    );
  }

  get customerId() {
    return this.cuid;
  }

  async fetchCustomer() {
    const { response } = await this.http.get("");
    return response as CustomerFullResponse;
  }

  async verifyCustomer(verificationLevel: "Level1" | "Level2") {
    const { response } = await this.http.put("", {
      verificationLevel,
    });
    return response as CustomerFullResponse;
  }

  async setCustomerActivationState(isActive: boolean) {
    const { response } = await this.http.put("", {
      isActive,
    });
    return response as CustomerFullResponse;
  }

  async setCustomerBlockingState(isBlocked: boolean) {
    const { response } = await this.http.put("", {
      isBlocked,
    });
    return response as CustomerFullResponse;
  }

  async setCustomerInvitationState(isInvited: boolean) {
    const { response } = await this.http.put("", {
      isInvited,
    });
    return response as CustomerFullResponse;
  }

  async updateCustomer(args: {
    firstName?: string;
    lastName?: string;
    email1?: string;
    phone1?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    firstNameMother?: string;
    lastNameMother?: string;
  }) {
    const { response } = await this.http.put("", args);
    return response as CustomerFullResponse;
  }

  async updateCustomerAddress({
    addressId,
    ...updateData
  }: CustomerUpdateAddressArgs) {
    const { response } = await this.http.put(
      `/address/${addressId}`,
      updateData
    );
    return response as CustomerFullResponse;
  }

  async uploadDocument({ documentType, file, onProgress }: UploadDocumentArgs) {
    const r2Uri = await fileService.uploadFile({
      file,
      onProgress,
    });

    return this.http.post("documents", {
      type: documentType,
      url: r2Uri.toString(),
    });
  }

  async deleteDocument(documentId: number) {
    return this.http.delete(`documents/${documentId}`);
  }
}
