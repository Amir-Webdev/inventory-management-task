import { useState, useEffect } from "react";
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
import { Product } from "../../types";
import { useProducts, useDeleteProduct } from "../../hooks/useProducts";

export default function Products() {
  const { data: products = [], isPending } = useProducts();
  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct();
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const handleClickOpen = (id: number) => {
    setSelectedProductId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProductId(null);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId!);
      handleClose();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
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
            Products
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/products/add"
          >
            Add Product
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>SKU</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Unit Cost</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Reorder Point</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(isPending || isDeleting) && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">
                    ${product.unitCost.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{product.reorderPoint}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      component={Link}
                      href={`/products/edit/${product.id}`}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleClickOpen(product.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No products available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this product? This action cannot
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
      </Container>
    </>
  );
}
