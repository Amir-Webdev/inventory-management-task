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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useDeleteTransfer, useTransfers } from "../../hooks/useTransfers";
import { useProducts } from "../../hooks/useProducts";
import { useWarehouses } from "../../hooks/useWarehouses";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { useState } from "react";

export default function Products() {
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
          Transfers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/transfers/add"
        >
          Add Transfer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Product</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Quantity</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Sending Warehouse</strong>
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="center">
                <strong>Receiving Warehouse</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
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
              <TableRow key={transfer.id}>
                <TableCell>{getProductName(transfer.productId)}</TableCell>
                <TableCell align="center">{transfer.quantity}</TableCell>
                <TableCell align="center">
                  {getWarehouseName(transfer.sendingWarehouseId)}
                </TableCell>
                <TableCell align="left">
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
    </Container>
  );
}
