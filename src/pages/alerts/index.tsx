import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Alerts
        </Typography>
      </Box>

      {/* Mobile Card Layout */}
      {isMobile ? (
        <Box>
          {isLoading && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">Loading...</Typography>
            </Box>
          )}

          {!isLoading &&
            rows.map((row) => (
              <Card
                key={row.productId}
                sx={{
                  mb: 2,
                  backgroundColor:
                    row.classification === "critical" ||
                    row.classification === "low"
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
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary"
                      >
                        {row.recommendedOrderQty} units
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mb: 2 }}>
                    {row.alert ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
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
                    }}
                  >
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
                  </Box>
                </CardContent>
              </Card>
            ))}

          {!isLoading && rows.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">No products found.</Typography>
            </Box>
          )}
        </Box>
      ) : (
        /* Desktop Table Layout */
        <TableContainer
          component={Paper}
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f5f9",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e1",
              borderRadius: 4,
            },
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Total
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Reorder Pt
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Classification</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Recommended Order
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Alert</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
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
                    <TableCell align="right">
                      {row.recommendedOrderQty}
                    </TableCell>
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
      )}
    </Box>
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
