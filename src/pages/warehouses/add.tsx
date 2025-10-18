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
import { warehouseFormSchema, type WarehouseFormInput } from "../../types";
import { useCreateWarehouse } from "../../hooks/useWarehouses";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { getErrorMessage } from "../../lib/api";

export default function AddWarehouse() {
  const router = useRouter();
  const { mutateAsync: createWarehouse, isPending } = useCreateWarehouse();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<WarehouseFormInput, any, WarehouseFormInput>({
    resolver: zodResolver(warehouseFormSchema) as any,
    defaultValues: {
      code: "",
      name: "",
      location: "",
    },
  });

  async function onSubmit(values: WarehouseFormInput) {
    setError(null);

    try {
      await createWarehouse(values);
      toast.success("Warehouse created successfully!");
      router.push("/warehouses");
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
          Add New Warehouse
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
            label="Warehouse Code"
            name="code"
            value={form.watch("code")}
            onChange={(e) => form.setValue("code", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Warehouse Name"
            name="name"
            value={form.watch("name")}
            onChange={(e) => form.setValue("name", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Location"
            name="location"
            value={form.watch("location")}
            onChange={(e) => form.setValue("location", e.target.value)}
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
              {isPending ? "Saving..." : "Add Warehouse"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/warehouses"
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
