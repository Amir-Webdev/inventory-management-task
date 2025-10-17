import Link from "next/link";
import {
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { InventoryOverviewType } from "../../types";

type InventoryTablePropTypes = {
  data: InventoryOverviewType[];
  isLoading: boolean;
};

function InventoryTable({ data, isLoading }: InventoryTablePropTypes) {
  return (
    <Card>
      <TableContainer
        sx={{
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f5f9",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: 4,
          },
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Product Details</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Stock Level
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Reorder Point
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <LinearProgress sx={{ width: 100 }} />
                    <Typography color="text.secondary">
                      Loading inventory data...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {data.slice(0, 10).map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <TableCell>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="text.primary"
                    >
                      {item.sku}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.category}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    {item.totalQuantity.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="text.secondary">
                    {item.reorderPoint}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={
                      item.isLowStock ? <WarningIcon /> : <CheckCircleIcon />
                    }
                    label={item.isLowStock ? "Low Stock" : "In Stock"}
                    color={item.isLowStock ? "warning" : "success"}
                    variant={item.isLowStock ? "filled" : "outlined"}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      component={Link}
                      href={`/products/edit/${item.id}`}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default InventoryTable;
