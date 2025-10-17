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
import { warehouseFormSchema, type WarehouseFormInput } from "../../types";
import { useCreateWarehouse } from "../../hooks/useWarehouses";

export default function AddWarehouse() {
  const router = useRouter();
  const { mutateAsync: createWarehouse, isPending } = useCreateWarehouse();
  const form = useForm<WarehouseFormInput, any, WarehouseFormInput>({
    resolver: zodResolver(warehouseFormSchema) as any,
    defaultValues: {
      code: "",
      name: "",
      location: "",
    },
  });

  async function onSubmit(values: WarehouseFormInput) {
    await createWarehouse(values);
    router.push("/warehouses");
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Warehouse
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
            label="Warehouse Code"
            name="code"
            value={form.watch("code")}
            onChange={(e) => form.setValue("code", e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Warehouse Name"
            name="name"
            value={form.watch("name")}
            onChange={(e) => form.setValue("name", e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Location"
            name="location"
            value={form.watch("location")}
            onChange={(e) => form.setValue("location", e.target.value)}
          />
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Add Warehouse"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/warehouses"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
