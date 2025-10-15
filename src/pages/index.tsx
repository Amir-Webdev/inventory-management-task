import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
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
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import CategoryIcon from "@mui/icons-material/Category";
import { InventoryOverview } from "../types";
import { useProducts } from "../hooks/useProducts";
import { useWarehouses } from "../hooks/useWarehouses";
import { useStock } from "../hooks/useStock";

export default function Home() {
  const { data: products = [], isPending: productsLoading } = useProducts();
  const { data: warehouses = [], isPending: warehousesLoading } =
    useWarehouses();
  const { data: stock = [], isPending: stockLoading } = useStock();
  const isLoading = productsLoading || warehousesLoading || stockLoading;

  // Calculate total inventory value
  const totalValue = stock.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.unitCost * item.quantity : 0);
  }, 0);

  // Get products with stock across all warehouses
  const inventoryOverview: InventoryOverview[] = products.map((product) => {
    const productStock = stock.filter((s) => s.productId === product.id);
    const totalQuantity = productStock.reduce((sum, s) => sum + s.quantity, 0);
    return {
      ...product,
      totalQuantity,
      isLowStock: totalQuantity < product.reorderPoint,
    };
  });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management System
          </Typography>
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
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CategoryIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Total Products</Typography>
                </Box>
                <Typography variant="h3">{products.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <WarehouseIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Warehouses</Typography>
                </Box>
                <Typography variant="h3">{warehouses.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <InventoryIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Total Inventory Value</Typography>
                </Box>
                <Typography variant="h3">${totalValue.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Inventory Overview Table */}
        <Typography variant="h5" gutterBottom>
          Inventory Overview
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>SKU</strong>
                </TableCell>
                <TableCell>
                  <strong>Product Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Total Stock</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Reorder Point</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
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
              {inventoryOverview.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    backgroundColor: item.isLowStock ? "#fff3e0" : "inherit",
                  }}
                >
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">{item.totalQuantity}</TableCell>
                  <TableCell align="right">{item.reorderPoint}</TableCell>
                  <TableCell>
                    {item.isLowStock ? (
                      <Typography color="warning.main" fontWeight="bold">
                        Low Stock
                      </Typography>
                    ) : (
                      <Typography color="success.main">In Stock</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
