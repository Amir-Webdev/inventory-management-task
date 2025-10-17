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
import { transferFormSchema, type TransferFormInput } from "../../types";
import { useProducts } from "../../hooks/useProducts";
import { useWarehouses } from "../../hooks/useWarehouses";
import { useCreateTransfer } from "../../hooks/useTransfers";

export default function AddTransfer() {
  const router = useRouter();
  const { data: products = [] } = useProducts();
  const { data: warehouses = [] } = useWarehouses();
  const { mutateAsync: createTransfer, isPending } = useCreateTransfer();
  const form = useForm<TransferFormInput, any, TransferFormInput>({
    resolver: zodResolver(transferFormSchema) as any,
    defaultValues: {
      productId: 0,
      sendingWarehouseId: 0,
      quantity: 0,
      receivingWarehouseId: 0,
    },
  });

  async function onSubmit(values: TransferFormInput) {
    if (values.receivingWarehouseId === values.sendingWarehouseId) return;
    await createTransfer(values);
    router.push("/transfers");
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Transfer Record
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
            onChange={(e) => form.setValue("productId", Number(e.target.value))}
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
            label="Sending Warehouse"
            name="sendingWarehouseId"
            value={form.watch("sendingWarehouseId") || ""}
            onChange={(e) =>
              form.setValue("sendingWarehouseId", Number(e.target.value))
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
            select
            label="Receiving Warehouse"
            name="receivingWarehouseId"
            value={form.watch("receivingWarehouseId") || ""}
            onChange={(e) =>
              form.setValue("receivingWarehouseId", Number(e.target.value))
            }
            error={!!form.formState.errors.receivingWarehouseId}
            helperText={form.formState.errors.receivingWarehouseId?.message}
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
          />
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Add Transfer"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/transfer"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
