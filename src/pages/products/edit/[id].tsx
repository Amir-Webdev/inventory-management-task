import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
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
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 600, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
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
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Product Name"
            name="name"
            value={form.watch("name")}
            onChange={(e) => form.setValue("name", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Category"
            name="category"
            value={form.watch("category")}
            onChange={(e) => form.setValue("category", e.target.value)}
            sx={{ mb: 2 }}
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
            onChange={(e) => form.setValue("unitCost", Number(e.target.value))}
            sx={{ mb: 2 }}
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
            sx={{ mb: 3 }}
          />
          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSaving}
              sx={{ order: { xs: 1, sm: 1 } }}
            >
              {isSaving ? "Saving..." : "Update Product"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/products"
              sx={{ order: { xs: 2, sm: 2 } }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
