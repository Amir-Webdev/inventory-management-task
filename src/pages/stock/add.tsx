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
  MenuItem,
  Alert,
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
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { getErrorMessage } from "../../lib/api";

export default function AddStock() {
  const router = useRouter();
  const { data: products = [] } = useProducts();
  const { data: warehouses = [] } = useWarehouses();
  const { mutateAsync: createStock, isPending } = useCreateStock();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<StockFormInput, any, StockFormInput>({
    resolver: zodResolver(stockFormSchema) as any,
    defaultValues: { productId: 0, warehouseId: 0, quantity: 0 },
  });

  async function onSubmit(values: StockFormInput) {
    setError(null);
    
    try {
      await createStock(values);
      toast.success("Stock record created successfully!");
      router.push("/stock");
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
          Add Stock Record
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
            select
            label="Product"
            name="productId"
            value={form.watch("productId") || ""}
            onChange={(e) => form.setValue("productId", Number(e.target.value))}
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
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
            onChange={(e) => form.setValue("quantity", Number(e.target.value))}
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
              {isPending ? "Saving..." : "Add Stock"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/stock"
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
