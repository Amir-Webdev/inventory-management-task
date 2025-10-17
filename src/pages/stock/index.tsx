import { useState } from "react";
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  AppBar,
  Toolbar,
  Box,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useStock } from "../../hooks/useStock";
import { useProducts } from "../../hooks/useProducts";
import { useWarehouses } from "../../hooks/useWarehouses";

export default function StockPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: stock = [], isPending: isLoadingStock } = useStock();
  const { data: products = [], isPending: isLoadingProducts } = useProducts();
  const { data: warehouses = [], isPending: isLoadingWarehouses } =
    useWarehouses();
  const [open, setOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);

  const getProductName = (productId: number): string => {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.name} (${product.sku})` : "Unknown";
  };

  const getWarehouseName = (warehouseId: number): string => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown";
  };

  const handleClickOpen = (id: number) => {
    setSelectedStockId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStockId(null);
  };

  const handleDelete = async () => {
    // Deleting is handled on edit page via mutation; list doesn't mutate directly
    // This dialog is kept for symmetry but action is not wired here
    handleClose();
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
          Stock Levels
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/stock/add"
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: "160px" },
          }}
        >
          Add Stock Record
        </Button>
      </Box>

      {/* Mobile Card Layout */}
      {isMobile ? (
        <Box>
          {(isLoadingStock || isLoadingProducts || isLoadingWarehouses) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">Loading...</Typography>
            </Box>
          )}

          {stock.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {getProductName(item.productId)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {getWarehouseName(item.warehouseId)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Chip
                    label={`Qty: ${item.quantity}`}
                    size="small"
                    color="primary"
                    variant="filled"
                  />
                </Box>

                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <IconButton
                    color="primary"
                    component={Link}
                    href={`/stock/edit/${item.id}`}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleClickOpen(item.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}

          {stock.length === 0 &&
            !isLoadingStock &&
            !isLoadingProducts &&
            !isLoadingWarehouses && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="text.secondary">
                  No stock records available.
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
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Warehouse</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(isLoadingStock || isLoadingProducts || isLoadingWarehouses) && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {stock.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{getProductName(item.productId)}</TableCell>
                  <TableCell>{getWarehouseName(item.warehouseId)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      component={Link}
                      href={`/stock/edit/${item.id}`}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleClickOpen(item.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {stock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No stock records available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Stock Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this stock record? This action
            cannot be undone.
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
