import Link from "next/link";
import {
  Typography,
  Box,
  Card,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  CardContent,
  Divider,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { InventoryOverviewType } from "../../types";

type InventoryListPropTypes = {
  data: InventoryOverviewType[];
  isLoading: boolean;
};

function InventoryList({ data, isLoading }: InventoryListPropTypes) {
  return (
    <Box>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 3,
            gap: 2,
          }}
        >
          <LinearProgress sx={{ width: 100 }} />
          <Typography color="text.secondary">
            Loading inventory data...
          </Typography>
        </Box>
      )}
      {data.slice(0, 10).map((item) => (
        <Card key={item.id} sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  {item.sku}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.name}
                </Typography>
              </Box>
              <Chip
                label={item.category}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Stock
              </Typography>
              <Typography variant="subtitle2" fontWeight={700}>
                {item.totalQuantity.toLocaleString()}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Reorder Point
              </Typography>
              <Typography variant="body2">{item.reorderPoint}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Chip
                icon={item.isLowStock ? <WarningIcon /> : <CheckCircleIcon />}
                label={item.isLowStock ? "Low Stock" : "In Stock"}
                color={item.isLowStock ? "warning" : "success"}
                variant={item.isLowStock ? "filled" : "outlined"}
                size="small"
                sx={{ borderRadius: 2 }}
              />
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  component={Link}
                  href={`/products/edit/${item.id}`}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default InventoryList;
