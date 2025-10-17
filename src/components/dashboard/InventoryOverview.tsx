import Link from "next/link";
import { Typography, Box, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InventoryList from "./InventoryList";
import InventoryTable from "./InventoryTable";
import { InventoryOverviewType } from "../../types";

type InventoryOverviewPropTypes = {
  data: InventoryOverviewType[];
  isLoading: boolean;
  isNarrow: boolean;
};

function InventoryOverview({
  data,
  isLoading,
  isNarrow,
}: InventoryOverviewPropTypes) {
  return (
    <Box sx={{ mb: { xs: 3, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          color="text.primary"
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          Inventory Overview
        </Typography>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          component={Link}
          href="/products"
          sx={{ borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
        >
          View All Products
        </Button>
      </Box>

      {isNarrow ? (
        <InventoryList isLoading={isLoading} data={data} />
      ) : (
        <InventoryTable isLoading={isLoading} data={data} />
      )}

      {data.length > 10 && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            component={Link}
            href="/products"
            sx={{ borderRadius: 2 }}
          >
            View All {data.length} Products
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default InventoryOverview;
