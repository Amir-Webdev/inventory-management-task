import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { productFormSchema, type ProductFormInput } from "../../../types";
import { useProduct, useUpdateProduct } from "../../../hooks/useProducts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const productId = id ? Number(id) : undefined;
  const { data, isPending } = useProduct(productId);
  const { mutateAsync: updateProduct, isPending: isSaving } = useUpdateProduct(
    productId as number
  );
  const form = useForm<ProductFormInput, any, ProductFormInput>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      sku: "",
      name: "",
      category: "",
      unitCost: 0,
      reorderPoint: 0,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        sku: data.sku,
        name: data.name,
        category: data.category,
        unitCost: data.unitCost,
        reorderPoint: data.reorderPoint,
      });
    }
  }, [data]);

  async function onSubmit(values: ProductFormInput) {
    await updateProduct(values);
    router.push("/products");
  }

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Product
          </Typography>
          <Box
            component="form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 2 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="SKU"
              name="sku"
              value={form.watch("sku")}
              onChange={(e) => form.setValue("sku", e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Product Name"
              name="name"
              value={form.watch("name")}
              onChange={(e) => form.setValue("name", e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Category"
              name="category"
              value={form.watch("category")}
              onChange={(e) => form.setValue("category", e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Unit Cost"
              name="unitCost"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              value={form.watch("unitCost")}
              onChange={(e) =>
                form.setValue("unitCost", Number(e.target.value))
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Reorder Point"
              name="reorderPoint"
              type="number"
              inputProps={{ min: "0" }}
              value={form.watch("reorderPoint")}
              onChange={(e) =>
                form.setValue("reorderPoint", Number(e.target.value))
              }
            />
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Update Product"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/products"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
