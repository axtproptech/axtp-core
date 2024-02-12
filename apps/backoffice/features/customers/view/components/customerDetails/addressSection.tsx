import { Typography } from "@mui/material";
import { EditableField } from "@/features/customers/view/components/editableField";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { customerService } from "@/app/services/customerService/customerService";
import { useRouter } from "next/router";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useSWRConfig } from "swr";

interface Props {
  customer: CustomerFullResponse;
}

export const AddressSection = ({ customer }: Props) => {
  const { mutate } = useSWRConfig();
  const { showError } = useSnackbar();

  const address = customer.addresses.length && customer.addresses[0];

  const handleAddressValueChange = async (name: string, updatedData: any) => {
    try {
      const addressId = customer.addresses.length
        ? customer.addresses[0].id
        : -1;
      await customerService.with(customer.cuid).updateCustomerAddress({
        addressId,
        [name]: updatedData,
      });
    } catch (e: any) {
      console.error("Updating customer address failed!", e);
      showError("Updating customer failed!");
    } finally {
      await mutate(`getCustomer/${customer.cuid}`);
    }
  };

  if (!address) {
    return (
      <>
        <Typography variant="h4">Address</Typography>
        <Typography variant="h4">No address provided</Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4">Address</Typography>
      <EditableField
        label="Street"
        initialValue={address.line1}
        name="line1"
        onSubmit={handleAddressValueChange}
      />
      <EditableField
        label="Complement"
        initialValue={address.line2}
        name="line2"
        onSubmit={handleAddressValueChange}
      />
      <EditableField
        label="Zip Code"
        initialValue={address.postCodeZip}
        name="postCodeZip"
        onSubmit={handleAddressValueChange}
      />
      <EditableField
        label="City"
        initialValue={address.city}
        name="city"
        onSubmit={handleAddressValueChange}
      />
      <EditableField
        label="State"
        initialValue={address.state}
        name="state"
        onSubmit={handleAddressValueChange}
      />
      <EditableField
        label="Country"
        initialValue={address.country}
        name="country"
        onSubmit={handleAddressValueChange}
      />

      <EditableField
        label="Annotation"
        initialValue={address.line2}
        name="line3"
        onSubmit={handleAddressValueChange}
      />
    </>
  );
};
