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
              disabled={isSaving}
              sx={{ order: { xs: 1, sm: 1 } }}
            >
              {isSaving ? "Saving..." : "Update Warehouse"}
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
