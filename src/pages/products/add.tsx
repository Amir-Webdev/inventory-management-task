import { useRouter } from "next/router";
import Link from "next/link";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productFormSchema, type ProductFormInput } from "../../types";
import { useCreateProduct } from "../../hooks/useProducts";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { getErrorMessage } from "../../lib/api";

export default function AddProduct() {
  const router = useRouter();
  const { mutateAsync: createProduct, isPending } = useCreateProduct();
  const [error, setError] = useState<string | null>(null);

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

  async function onSubmit(values: ProductFormInput) {
    setError(null);

    try {
      await createProduct(values);
      toast.success("Product created successfully!");
      router.push("/products");
    } catch (err) {
      const errorMessage = getErrorMessage(err as AxiosError);
      setError(errorMessage);
      toast.error(errorMessage);
    }
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
          Add New Product
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
              disabled={isPending}
              sx={{ order: { xs: 1, sm: 1 } }}
            >
              {isPending ? "Saving..." : "Add Product"}
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
