import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useProducts } from "../../hooks/useProducts";
import { useStock } from "../../hooks/useStock";
import {
  useAlerts,
  useCreateAlert,
  useUpdateAlert,
} from "../../hooks/useAlerts";
import type { Alert } from "../../types";

function classify(totalQuantity: number, reorderPoint: number) {
  if (totalQuantity === 0) return "critical" as const;
  if (totalQuantity < reorderPoint) return "low" as const;
  if (totalQuantity <= reorderPoint * 2) return "adequate" as const;
  return "overstock" as const;
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

export default function AlertsPage() {
  const { data: products = [], isPending: isLoadingProducts } = useProducts();
  const { data: stock = [], isPending: isLoadingStock } = useStock();
  const { data: alerts = [], isPending: isLoadingAlerts } = useAlerts();
  const { mutate: createAlert } = useCreateAlert();

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

  const isLoading = isLoadingProducts || isLoadingStock || isLoadingAlerts;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Alerts
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>SKU</strong>
              </TableCell>
              <TableCell>
                <strong>Product</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Total</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Reorder Pt</strong>
              </TableCell>
              <TableCell>
                <strong>Classification</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Recommended Order</strong>
              </TableCell>
              <TableCell>
                <strong>Alert</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              rows.map((row) => (
                <TableRow
                  key={row.productId}
                  sx={{
                    backgroundColor:
                      row.classification === "critical" ||
                      row.classification === "low"
                        ? "#fff3e0"
                        : "inherit",
                  }}
                >
                  <TableCell>{row.sku}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.totalQuantity}</TableCell>
                  <TableCell align="right">{row.reorderPoint}</TableCell>
                  <TableCell>
                    {getClassificationChip(row.classification)}
                  </TableCell>
                  <TableCell align="right">{row.recommendedOrderQty}</TableCell>
                  <TableCell>
                    {row.alert ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={row.alert.status} size="small" />
                        {getClassificationChip(row.alert.classification)}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">None</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {!row.alert &&
                        (row.classification === "critical" ||
                          row.classification === "low") && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => createAlertIfNeeded(row)}
                          >
                            Create Alert
                          </Button>
                        )}
                      {row.alert && row.alert.status !== "resolved" && (
                        <AlertActions alertId={row.alert.id} />
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

function AlertActions({ alertId }: { alertId: number }) {
  const { mutate: update } = useUpdateAlert(alertId);
  return (
    <Stack direction="row" spacing={1}>
      <Button size="small" onClick={() => update({ status: "acknowledged" })}>
        Acknowledge
      </Button>
      <Button size="small" onClick={() => update({ status: "ordered" })}>
        Mark Ordered
      </Button>
      <Button
        size="small"
        color="success"
        onClick={() => update({ status: "resolved" })}
      >
        Resolve
      </Button>
    </Stack>
  );
}
