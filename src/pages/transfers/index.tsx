import Link from "next/link";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useTransfers } from "../../hooks/useTransfers";
import { useProducts } from "../../hooks/useProducts";
import { useWarehouses } from "../../hooks/useWarehouses";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

export default function Products() {
  const { data: transfers = [], isPending: isLoadingTransfers } =
    useTransfers();
  const { data: products = [], isPending: isLoadingProducts } = useProducts();
  const { data: warehouses = [], isPending: isLoadingWarehouses } =
    useWarehouses();

  function getProductName(productId: number): string {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.name} (${product.sku})` : "Unknown";
  }

  function getWarehouseName(warehouseId: number): string {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown";
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management System
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} href="/products">
            Products
          </Button>
          <Button color="inherit" component={Link} href="/warehouses">
            Warehouses
          </Button>
          <Button color="inherit" component={Link} href="/stock">
            Stock Levels
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Transfers
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/transfers/add"
          >
            Add Transfer
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Product</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Sending Warehouse</strong>
                </TableCell>
                <TableCell></TableCell>
                <TableCell align="center">
                  <strong>Receiving Warehouse</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(isLoadingProducts ||
                isLoadingTransfers ||
                isLoadingWarehouses) && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{getProductName(transfer.productId)}</TableCell>
                  <TableCell align="center">{transfer.quantity}</TableCell>
                  <TableCell align="center">
                    {getWarehouseName(transfer.sendingWarehouseId)}
                  </TableCell>
                  <TableCell align="left">
                    <TrendingFlatIcon color="success" />
                  </TableCell>
                  <TableCell align="center">
                    {getWarehouseName(transfer.receivingWarehouseId)}
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
      </Container>
    </>
  );
}
