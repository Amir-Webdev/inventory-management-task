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
  CircularProgress,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { warehouseFormSchema, type WarehouseFormInput } from "../../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useWarehouse, useUpdateWarehouse } from "../../../hooks/useWarehouses";

export default function EditWarehouse() {
  const router = useRouter();
  const { id } = router.query;
  const warehouseId = id ? Number(id) : undefined;
  const { data, isPending } = useWarehouse(warehouseId);
  const { mutateAsync: updateWarehouse, isPending: isSaving } =
    useUpdateWarehouse(warehouseId as number);
  const form = useForm<WarehouseFormInput, any, WarehouseFormInput>({
    resolver: zodResolver(warehouseFormSchema) as any,
    defaultValues: { code: "", name: "", location: "" },
  });

  useEffect(() => {
    if (data) {
      form.reset({ code: data.code, name: data.name, location: data.location });
    }
  }, [data]);

  async function onSubmit(values: WarehouseFormInput) {
    await updateWarehouse(values);
    router.push("/warehouses");
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
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Warehouse
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
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Update Warehouse"}
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
