import { useState } from "react";
import Link from "next/link";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useWarehouses, useDeleteWarehouse } from "../../hooks/useWarehouses";
import WarehousesList from "../../components/warehouses/WarehousesList";
import WarehousesTable from "../../components/warehouses/WarehousesTable";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../lib/api";
import { AxiosError } from "axios";

export default function Warehouses() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: warehouses = [], isPending } = useWarehouses();
  const { mutateAsync: deleteWarehouse, isPending: isDeleting } =
    useDeleteWarehouse();
  const [open, setOpen] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null
  );

  const isLoading = isPending || isDeleting;

  const handleClickOpen = (id: number) => {
    setSelectedWarehouseId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedWarehouseId(null);
  };

  const handleDelete = async () => {
    if (!selectedWarehouseId) return;
    try {
      await deleteWarehouse(selectedWarehouseId!);
      toast.success("Warehouse Deleted Successfully!");
    } catch (error) {
      const errorMessage = getErrorMessage(error as AxiosError);
      toast.error(errorMessage);
    } finally {
      handleClose();
    }
  };

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
          Warehouses
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/warehouses/add"
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: "160px" },
          }}
        >
          Add Warehouse
        </Button>
      </Box>

      {/* Mobile Card Layout */}
      {isMobile ? (
        <WarehousesList
          isLoading={isLoading}
          onClickOpen={handleClickOpen}
          warehouses={warehouses}
        />
      ) : (
        /* Desktop Table Layout */
        <WarehousesTable
          isLoading={isLoading}
          onClickOpen={handleClickOpen}
          warehouses={warehouses}
        />
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Warehouse</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this warehouse? This action cannot
            be undone.
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
