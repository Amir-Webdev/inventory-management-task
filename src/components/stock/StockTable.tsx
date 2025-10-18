import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
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

export default function StockTable({
  stock,
  getProductName,
  getWarehouseName,
  onClickOpen,
  isLoading,
}: Props) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        overflowX: "auto",
        "&::-webkit-scrollbar": { height: 8 },
        "&::-webkit-scrollbar-track": { backgroundColor: "#f1f5f9" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#cbd5e1",
          borderRadius: 4,
        },
      }}
    >
      <Table sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Warehouse</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Loading...
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            stock.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{getProductName(item.productId)}</TableCell>
                <TableCell>{getWarehouseName(item.warehouseId)}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && stock.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography color="text.secondary">
                  No stock records available.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
