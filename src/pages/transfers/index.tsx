import Link from "next/link";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDeleteTransfer, useTransfers } from "../../hooks/useTransfers";
import { useProducts } from "../../hooks/useProducts";
import { useWarehouses } from "../../hooks/useWarehouses";
import { useState } from "react";
import TransfersTable from "../../components/transfers/TransfersTable";
import TransfersList from "../../components/transfers/TransfersList";
import { getErrorMessage } from "../../lib/api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

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

  const isLoading =
    isDeleting ||
    isLoadingProducts ||
    isLoadingTransfers ||
    isLoadingWarehouses;

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
      toast.success("Transfer Deleted Successfully!");
    } catch (error) {
      const errorMessage = getErrorMessage(error as AxiosError);
      toast.error(errorMessage);
    } finally {
      handleClose();
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
        <TransfersList
          getProductName={getProductName}
          getWarehouseName={getWarehouseName}
          isLoading={isLoading}
          onClickOpen={handleClickOpen}
          transfers={transfers}
        />
      ) : (
        /* Desktop Table Layout */
        <TransfersTable
          getProductName={getProductName}
          getWarehouseName={getWarehouseName}
          isLoading={isLoading}
          onClickOpen={handleClickOpen}
          transfers={transfers}
        />
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
