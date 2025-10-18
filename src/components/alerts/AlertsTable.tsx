import {
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
  Button,
  Box,
} from "@mui/material";
import AlertActions from "./AlertActions";

export default function AlertsTable({
  rows,
  isLoading,
  createAlertIfNeeded,
  getClassificationChip,
}: any) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        overflowX: "scroll",
        overflowY: "hidden",
        maxWidth: "80%",
        "&::-webkit-scrollbar": { height: 8 },
        "&::-webkit-scrollbar-track": { backgroundColor: "#f1f5f9" },
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
              Recommended
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
            rows.map((row: any) => (
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
                    <Stack direction="row" spacing={1}>
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
  );
}
