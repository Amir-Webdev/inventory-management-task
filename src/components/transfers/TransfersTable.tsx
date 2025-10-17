import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { Transfer } from "../../types";

type TransfersTablePropTypes = {
  isLoading: boolean;
  onClickOpen: (id: number) => void;
  transfers: Transfer[];
  getWarehouseName: (warehouseId: number) => string;
  getProductName: (productId: number) => string;
};

function TransfersTable({
  isLoading,
  onClickOpen,
  transfers,
  getProductName,
  getWarehouseName,
}: TransfersTablePropTypes) {
  return (
    <TableContainer
      component={Paper}
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
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>
              Quantity
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>
              Sending Warehouse
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}></TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>
              Receiving Warehouse
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Loading...
              </TableCell>
            </TableRow>
          )}
          {transfers.map((transfer) => (
            <TableRow key={transfer.id} hover>
              <TableCell>{getProductName(transfer.productId)}</TableCell>
              <TableCell align="center">{transfer.quantity}</TableCell>
              <TableCell align="center">
                {getWarehouseName(transfer.sendingWarehouseId)}
              </TableCell>
              <TableCell align="center">
                <TrendingFlatIcon color="success" />
              </TableCell>
              <TableCell align="center">
                {getWarehouseName(transfer.receivingWarehouseId)}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="error"
                  onClick={() => onClickOpen(transfer.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {transfers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No transfers available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransfersTable;
