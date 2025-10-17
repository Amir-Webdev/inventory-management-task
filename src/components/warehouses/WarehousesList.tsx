import Link from "next/link";
import {
  Typography,
  IconButton,
  Box,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Warehouse } from "../../types";

type WarehousesListPropTypes = {
  isLoading: boolean;
  warehouses: Warehouse[];
  onClickOpen: (id: number) => void;
};

function WarehousesList({
  isLoading,
  warehouses,
  onClickOpen,
}: WarehousesListPropTypes) {
  return (
    <Box>
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      )}

      {warehouses.map((warehouse) => (
        <Card key={warehouse.id} sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {warehouse.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Code: {warehouse.code}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Chip
                label={warehouse.location}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <IconButton
                color="primary"
                component={Link}
                href={`/warehouses/edit/${warehouse.id}`}
                size="small"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => onClickOpen(warehouse.id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {warehouses.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No warehouses available.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default WarehousesList;
