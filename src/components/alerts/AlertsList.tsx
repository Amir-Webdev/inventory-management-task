import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import AlertActions from "./AlertActions";

export default function AlertsList({
  rows,
  isLoading,
  createAlertIfNeeded,
  getClassificationChip,
}: any) {
  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">No products found.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {rows.map((row: any) => (
        <Card
          key={row.productId}
          sx={{
            mb: 2,
            backgroundColor:
              row.classification === "critical" || row.classification === "low"
                ? "#fff3e0"
                : "inherit",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {row.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {row.sku}
              </Typography>
            </Box>

            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Total Stock
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {row.totalQuantity}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Reorder Point
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {row.reorderPoint}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                {getClassificationChip(row.classification)}
              </Grid>
            </Grid>

            {row.recommendedOrderQty > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Recommended Order
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary">
                  {row.recommendedOrderQty} units
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              {row.alert ? (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={row.alert.status} size="small" />
                  {getClassificationChip(row.alert.classification)}
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No active alert
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {!row.alert &&
                (row.classification === "critical" ||
                  row.classification === "low") && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => createAlertIfNeeded(row)}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    Create Alert
                  </Button>
                )}
              {row.alert && row.alert.status !== "resolved" && (
                <Box sx={{ width: "100%" }}>
                  <AlertActions alertId={row.alert.id} />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
