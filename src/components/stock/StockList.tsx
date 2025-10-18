import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  stock: any[];
  getProductName: (id: number) => string;
  getWarehouseName: (id: number) => string;
  onClickOpen: (id: number) => void;
  isLoading: boolean;
}

export default function StockList({
  stock,
  getProductName,
  getWarehouseName,
  onClickOpen,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (stock.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          No stock records available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {stock.map((item) => (
        <Card key={item.id} sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {getProductName(item.productId)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {getWarehouseName(item.warehouseId)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Chip
                label={`Qty: ${item.quantity}`}
                size="small"
                color="primary"
                variant="filled"
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <IconButton
                color="primary"
                component={Link}
                href={`/stock/edit/${item.id}`}
                size="small"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => onClickOpen(item.id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
