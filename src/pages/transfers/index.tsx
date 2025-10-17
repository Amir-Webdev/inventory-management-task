import Link from "next/link";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useDeleteTransfer, useTransfers } from "../../hooks/useTransfers";
import { useProducts } from "../../hooks/useProducts";
import { useWarehouses } from "../../hooks/useWarehouses";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { useState } from "react";

export default function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(
    null
  );

  const { data: transfers = [], isPending: isLoadingTransfers } =
    useTransfers();
  const { data: products = [], isPending: isLoadingProducts } = useProducts();
  const { data: warehouses = [], isPending: isLoadingWarehouses } =
    useWarehouses();
  const { mutateAsync: deleteTransfer, isPending: isDeleting } =
    useDeleteTransfer();

  function getProductName(productId: number): string {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.name} (${product.sku})` : "Unknown";
  }

  function getWarehouseName(warehouseId: number): string {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown";
  }

  function handleClickOpen(id: number) {
    setSelectedTransferId(id);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setSelectedTransferId(null);
  }

  async function handleDelete() {
    if (!selectedTransferId) return;
    try {
      await deleteTransfer(selectedTransferId);
      handleClose();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Transfers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/transfers/add"
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: "140px" },
          }}
        >
          Add Transfer
        </Button>
      </Box>

      {/* Mobile Card Layout */}
      {isMobile ? (
        <Box>
          {(isLoadingProducts ||
            isLoadingTransfers ||
            isLoadingWarehouses ||
            isDeleting) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">Loading...</Typography>
            </Box>
          )}

          {transfers.map((transfer) => (
            <Card key={transfer.id} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {getProductName(transfer.productId)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Quantity: {transfer.quantity}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
                >
                  <Chip
                    label={getWarehouseName(transfer.sendingWarehouseId)}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                  <TrendingFlatIcon color="success" fontSize="small" />
                  <Chip
                    label={getWarehouseName(transfer.receivingWarehouseId)}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>

                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <IconButton
                    color="error"
                    onClick={() => handleClickOpen(transfer.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}

          {transfers.length === 0 &&
            !isLoadingProducts &&
            !isLoadingTransfers &&
            !isLoadingWarehouses &&
            !isDeleting && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="text.secondary">
                  No transfers available.
                </Typography>
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
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Quantity
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Sending Warehouse
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}></TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Receiving Warehouse
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(isLoadingProducts ||
                isLoadingTransfers ||
                isLoadingWarehouses ||
                isDeleting) && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {transfers.map((transfer) => (
                <TableRow key={transfer.id} hover>
                  <TableCell>{getProductName(transfer.productId)}</TableCell>
                  <TableCell align="center">{transfer.quantity}</TableCell>
                  <TableCell align="center">
                    {getWarehouseName(transfer.sendingWarehouseId)}
                  </TableCell>
                  <TableCell align="center">
                    <TrendingFlatIcon color="success" />
                  </TableCell>
                  <TableCell align="center">
                    {getWarehouseName(transfer.receivingWarehouseId)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleClickOpen(transfer.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {transfers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No transfers available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Transfer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transfer? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
