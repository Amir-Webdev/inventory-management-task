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
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productFormSchema, type ProductFormInput } from "../../types";
import { useCreateProduct } from "../../hooks/useProducts";

export default function AddProduct() {
  const router = useRouter();
  const { mutateAsync: createProduct, isPending } = useCreateProduct();
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
    await createProduct(values);
    router.push("/products");
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
            Add New Product
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
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Add Product"}
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
