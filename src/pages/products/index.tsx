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
import { useProducts, useDeleteProduct } from "../../hooks/useProducts";
import ProductsTable from "../../components/products/ProductsTable";
import ProductsList from "../../components/products/ProductsList";
import { getErrorMessage } from "../../lib/api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

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
  const isLoading = isPending || isDeleting;

  const handleClickOpen = (id: number) => {
    setSelectedProductId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProductId(null);
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;
    try {
      await deleteProduct(selectedProductId!);
      toast.success("Product Deleted Successfully!");
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
        <ProductsList
          isLoading={isLoading}
          products={products}
          onClickOpen={handleClickOpen}
        />
      ) : (
        /* Desktop Table Layout */
        <ProductsTable
          isLoading={isLoading}
          products={products}
          onClickOpen={handleClickOpen}
        />
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
