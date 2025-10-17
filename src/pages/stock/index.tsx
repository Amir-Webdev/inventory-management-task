"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useStock } from "../../hooks/useStock";
import { useProducts } from "../../hooks/useProducts";
import { useWarehouses } from "../../hooks/useWarehouses";
import StockTable from "../../components/stock/StockTable";
import StockList from "../../components/stock/StockList";

export default function StockPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: stock = [], isPending: isLoadingStock } = useStock();
  const { data: products = [], isPending: isLoadingProducts } = useProducts();
  const { data: warehouses = [], isPending: isLoadingWarehouses } =
    useWarehouses();

  const [open, setOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setSelectedStockId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStockId(null);
  };

  const getProductName = (productId: number): string => {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.name} (${product.sku})` : "Unknown";
  };

  const getWarehouseName = (warehouseId: number): string => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown";
  };

  const isLoading = isLoadingStock || isLoadingProducts || isLoadingWarehouses;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
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
          Stock Levels
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/stock/add"
          sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { sm: "160px" } }}
        >
          Add Stock Record
        </Button>
      </Box>

      {/* Responsive Layout */}
      {isMobile ? (
        <StockList
          stock={stock}
          getProductName={getProductName}
          getWarehouseName={getWarehouseName}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      ) : (
        <StockTable
          stock={stock}
          getProductName={getProductName}
          getWarehouseName={getWarehouseName}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}

      {/* Delete Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Stock Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this stock record? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" onClick={handleClose} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
