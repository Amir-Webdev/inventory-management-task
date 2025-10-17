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
  Grid,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Product } from "../../types";
import { useProducts, useDeleteProduct } from "../../hooks/useProducts";

export default function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/products/add"
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: "140px" },
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Mobile Card Layout */}
      {isMobile ? (
        <Box>
          {(isPending || isDeleting) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">Loading...</Typography>
            </Box>
          )}

          {products.map((product) => (
            <Card key={product.id} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SKU: {product.sku}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip
                    label={product.category}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`$${product.unitCost.toFixed(2)}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Reorder: ${product.reorderPoint}`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>

                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
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
                </Box>
              </CardContent>
            </Card>
          ))}

          {products.length === 0 && !isPending && !isDeleting && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No products available.
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
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Unit Cost
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Reorder Point
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
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
                <TableRow key={product.id} hover>
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
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
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
