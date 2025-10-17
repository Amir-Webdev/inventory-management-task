import {
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { Transfer } from "../../types";

type TransfersListPropTypes = {
  isLoading: boolean;
  onClickOpen: (id: number) => void;
  transfers: Transfer[];
  getWarehouseName: (warehouseId: number) => string;
  getProductName: (productId: number) => string;
};

function TransfersList({
  isLoading,
  onClickOpen,
  transfers,
  getProductName,
  getWarehouseName,
}: TransfersListPropTypes) {
  return (
    <Box>
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      )}

      {transfers.map((transfer) => (
        <Card key={transfer.id} sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {getProductName(transfer.productId)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quantity: {transfer.quantity}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
              <Chip
                label={getWarehouseName(transfer.sendingWarehouseId)}
                size="small"
                variant="outlined"
                color="secondary"
              />
              <TrendingFlatIcon color="success" fontSize="small" />
              <Chip
                label={getWarehouseName(transfer.receivingWarehouseId)}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <IconButton
                color="error"
                onClick={() => onClickOpen(transfer.id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {transfers.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No transfers available.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default TransfersList;
