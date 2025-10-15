import { useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  stockFormSchema,
  type StockFormInput,
  type Product,
  type Warehouse,
} from "../../types";
import { useProducts } from "../../hooks/useProducts";
import { useWarehouses } from "../../hooks/useWarehouses";
import { useCreateStock } from "../../hooks/useStock";

export default function AddStock() {
  const router = useRouter();
  const { data: products = [] } = useProducts();
  const { data: warehouses = [] } = useWarehouses();
  const { mutateAsync: createStock, isPending } = useCreateStock();
  const form = useForm<StockFormInput, any, StockFormInput>({
    resolver: zodResolver(stockFormSchema) as any,
    defaultValues: { productId: 0, warehouseId: 0, quantity: 0 },
  });

  async function onSubmit(values: StockFormInput) {
    await createStock(values);
    router.push("/stock");
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
            Add Stock Record
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
              select
              label="Product"
              name="productId"
              value={form.watch("productId") || ""}
              onChange={(e) =>
                form.setValue("productId", Number(e.target.value))
              }
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Warehouse"
              name="warehouseId"
              value={form.watch("warehouseId") || ""}
              onChange={(e) =>
                form.setValue("warehouseId", Number(e.target.value))
              }
            >
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              inputProps={{ min: "0" }}
              value={form.watch("quantity")}
              onChange={(e) =>
                form.setValue("quantity", Number(e.target.value))
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
                {isPending ? "Saving..." : "Add Stock"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/stock"
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
