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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useStock } from "../../hooks/useStock";
import { useProducts } from "../../hooks/useProducts";
import { useWarehouses } from "../../hooks/useWarehouses";

export default function StockPage() {
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
    <>
      <AppBar position="static">
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management System
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} href="/products">
            Products
          </Button>
          <Button color="inherit" component={Link} href="/warehouses">
            Warehouses
          </Button>
          <Button color="inherit" component={Link} href="/stock">
            Stock Levels
          </Button>
        </Toolbar>
      </AppBar>

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
            Stock Levels
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/stock/add"
          >
            Add Stock Record
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Product</strong>
                </TableCell>
                <TableCell>
                  <strong>Warehouse</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
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
                <TableRow key={item.id}>
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
      </Container>
    </>
  );
}
