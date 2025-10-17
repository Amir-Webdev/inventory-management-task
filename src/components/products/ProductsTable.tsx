import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { Product } from "../../types";

type ProductsTablePropTypes = {
  isLoading: boolean;
  products: Product[];
  onClickOpen: (id: number) => void;
};

function ProductsTable({
  isLoading,
  products,
  onClickOpen,
}: ProductsTablePropTypes) {
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
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Unit Cost
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Reorder Point
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
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
          {products.map((product) => (
            <TableRow key={product.id} hover>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell align="right">
                ${product.unitCost.toFixed(2)}
              </TableCell>
              <TableCell align="right">{product.reorderPoint}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  component={Link}
                  href={`/products/edit/${product.id}`}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onClickOpen(product.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No products available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProductsTable;
