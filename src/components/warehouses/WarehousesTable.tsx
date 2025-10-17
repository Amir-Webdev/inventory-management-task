import Link from "next/link";
import {
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Warehouse } from "../../types";

type WarehousesTablePropTypes = {
  isLoading: boolean;
  warehouses: Warehouse[];
  onClickOpen: (id: number) => void;
};

function WarehousesTable({
  isLoading,
  onClickOpen,
  warehouses,
}: WarehousesTablePropTypes) {
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
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
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
          {warehouses.map((warehouse) => (
            <TableRow key={warehouse.id} hover>
              <TableCell>{warehouse.code}</TableCell>
              <TableCell>{warehouse.name}</TableCell>
              <TableCell>{warehouse.location}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
          {warehouses.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No warehouses available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WarehousesTable;
