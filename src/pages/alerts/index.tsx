import { Box, Chip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useProducts } from "../../hooks/useProducts";
import { useStock } from "../../hooks/useStock";
import { useAlerts, useCreateAlert } from "../../hooks/useAlerts";
import type { Alert } from "../../types";
import { classify } from "../../components/alerts/utils/classify";
import AlertsList from "../../components/alerts/AlertsList";
import AlertsTable from "../../components/alerts/AlertsTable";

export default function AlertsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data: products = [], isPending: isLoadingProducts } = useProducts();
  const { data: stock = [], isPending: isLoadingStock } = useStock();
  const { data: alerts = [], isPending: isLoadingAlerts } = useAlerts();
  const { mutate: createAlert } = useCreateAlert();

  const isLoading = isLoadingProducts || isLoadingStock || isLoadingAlerts;

  const totalsByProduct = products.map((product) => {
    const totalQuantity = stock
      .filter((s) => s.productId === product.id)
      .reduce((sum, s) => sum + s.quantity, 0);
    return {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      reorderPoint: product.reorderPoint,
      totalQuantity,
      classification: classify(totalQuantity, product.reorderPoint),
    };
  });

  const alertsByProductId = new Map<number, Alert>();
  for (const alert of alerts) alertsByProductId.set(alert.productId, alert);

  const rows = totalsByProduct.map((row) => ({
    ...row,
    alert: alertsByProductId.get(row.productId),
    recommendedOrderQty:
      row.classification === "critical" || row.classification === "low"
        ? Math.max(row.reorderPoint * 2 - row.totalQuantity, 0)
        : 0,
  }));

  function createAlertIfNeeded(row: (typeof rows)[number]) {
    if (row.alert) return;
    createAlert({
      productId: row.productId,
      totalQuantity: row.totalQuantity,
      reorderPoint: row.reorderPoint,
      status: "new",
      classification: row.classification,
      note: undefined,
    });
  }

  function getClassificationChip(classification: string) {
    const color =
      classification === "critical"
        ? "error"
        : classification === "low"
        ? "warning"
        : classification === "adequate"
        ? "default"
        : "success";

    return <Chip label={classification} color={color as any} size="small" />;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Alerts
        </Typography>
      </Box>

      {isMobile ? (
        <AlertsList
          rows={rows}
          isLoading={isLoading}
          createAlertIfNeeded={createAlertIfNeeded}
          getClassificationChip={getClassificationChip}
        />
      ) : (
        <AlertsTable
          rows={rows}
          isLoading={isLoading}
          createAlertIfNeeded={createAlertIfNeeded}
          getClassificationChip={getClassificationChip}
        />
      )}
    </Box>
  );
}
