import { Grid, Typography } from "@mui/material";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { Config } from "@/app/config";
import { DocumentItem } from "./documentItem";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  customer: CustomerFullResponse;
}

export const CustomerDocuments = ({ customer }: Props) => {
  const { documents } = customer;

  return (
    <section>
      <Typography variant="h4">Documents</Typography>
      <Grid container spacing={gridSpacing} direction="row">
        {documents.map((d, index) => (
          <Grid item xs={12} lg={3} sx={{ my: 2 }} key={d.id}>
            <DocumentItem document={d} cuid={customer.cuid} />
          </Grid>
        ))}
      </Grid>
    </section>
  );
};
