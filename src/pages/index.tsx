import Link from "next/link";
import {
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
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { InventoryOverview } from "../types";
import { useProducts } from "../hooks/useProducts";
import { useWarehouses } from "../hooks/useWarehouses";
import { useStock } from "../hooks/useStock";
import { useAlerts } from "../hooks/useAlerts";

export default function Home() {
  const theme = useTheme();
  const isNarrow = useMediaQuery("(max-width:700px)");
  const { data: products = [], isPending: productsLoading } = useProducts();
  const { data: warehouses = [], isPending: warehousesLoading } =
    useWarehouses();
  const { data: stock = [], isPending: stockLoading } = useStock();
  const { data: alerts = [], isPending: alertsLoading } = useAlerts();
  const isLoading =
    productsLoading || warehousesLoading || stockLoading || alertsLoading;

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

  // Calculate additional metrics
  const lowStockProducts = inventoryOverview.filter(
    (item) => item.isLowStock
  ).length;
  const totalStockItems = stock.reduce((sum, item) => sum + item.quantity, 0);
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved").length;
  const activeAlerts = alerts.filter((a) => a.status !== "resolved").length;

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="text.primary"
          gutterBottom
          sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" } }}
        >
          Welcome to Inventory Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your inventory, track stock levels, and manage alerts from
          your dashboard.
        </Typography>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{ height: "100%", position: "relative", overflow: "hidden" }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                  <CategoryIcon />
                </Avatar>
              </Box>
              <Typography variant="h3" fontWeight={700} color="text.primary">
                {products.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Products
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((products.length / 100) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "primary.main",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{ height: "100%", position: "relative", overflow: "hidden" }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: "info.main", width: 48, height: 48 }}>
                  <WarehouseIcon />
                </Avatar>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" color="text.secondary">
                    {warehouses.length} Active
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight={700} color="text.primary">
                {warehouses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Warehouses
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((warehouses.length / 10) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "info.main",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{ height: "100%", position: "relative", overflow: "hidden" }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: "success.main", width: 48, height: 48 }}>
                  <InventoryIcon />
                </Avatar>
              </Box>
              <Typography variant="h3" fontWeight={700} color="text.primary">
                $
                {totalValue.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Inventory Value
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((totalValue / 100000) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "success.main",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{ height: "100%", position: "relative", overflow: "hidden" }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: "warning.main", width: 48, height: 48 }}>
                  <WarningIcon />
                </Avatar>
              </Box>
              <Typography variant="h3" fontWeight={700} color="text.primary">
                {activeAlerts}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Active Alerts
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(
                  (activeAlerts / Math.max(products.length, 1)) * 100,
                  100
                )}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "warning.main",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Stats Row */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    {lowStockProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Need immediate attention
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "error.main", width: 56, height: 56 }}>
                  <WarningIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Total Stock Units
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {totalStockItems.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Across all warehouses
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "info.main", width: 56, height: 56 }}>
                  <InventoryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Resolved Alerts
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="success.main"
                  >
                    {resolvedAlerts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56 }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Inventory Overview Section */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            color="text.primary"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            Inventory Overview
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            component={Link}
            href="/products"
            sx={{ borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
          >
            View All Products
          </Button>
        </Box>

        {isNarrow ? (
          <Box>
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3, gap: 2 }}>
                <LinearProgress sx={{ width: 100 }} />
                <Typography color="text.secondary">Loading inventory data...</Typography>
              </Box>
            )}
            {inventoryOverview.slice(0, 10).map((item) => (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>{item.sku}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.name}</Typography>
                    </Box>
                    <Chip label={item.category} size="small" variant="outlined" sx={{ borderRadius: 2 }} />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Stock</Typography>
                    <Typography variant="subtitle2" fontWeight={700}>{item.totalQuantity.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Reorder Point</Typography>
                    <Typography variant="body2">{item.reorderPoint}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      icon={item.isLowStock ? <WarningIcon /> : <CheckCircleIcon />}
                      label={item.isLowStock ? "Low Stock" : "In Stock"}
                      color={item.isLowStock ? "warning" : "success"}
                      variant={item.isLowStock ? "filled" : "outlined"}
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                    <Tooltip title="View Details">
                      <IconButton size="small" component={Link} href={`/products/edit/${item.id}`}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
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
                    <TableCell sx={{ fontWeight: 600 }}>
                      Product Details
                    </TableCell>
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
                  {inventoryOverview.slice(0, 10).map((item) => (
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
                            item.isLowStock ? (
                              <WarningIcon />
                            ) : (
                              <CheckCircleIcon />
                            )
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
        )}

        {inventoryOverview.length > 10 && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              variant="text"
              endIcon={<ArrowForwardIcon />}
              component={Link}
              href="/products"
              sx={{ borderRadius: 2 }}
            >
              View All {inventoryOverview.length} Products
            </Button>
          </Box>
        )}
      </Box>

      {/* Quick Actions */}
      <Card sx={{ mb: { xs: 3, md: 4 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            fontWeight={600}
            color="text.primary"
            gutterBottom
          >
            Quick Actions
          </Typography>
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CategoryIcon />}
                component={Link}
                href="/products/add"
                sx={{ borderRadius: 2, py: { xs: 1.25, sm: 1.5 } }}
              >
                Add Product
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<WarehouseIcon />}
                component={Link}
                href="/warehouses/add"
                sx={{ borderRadius: 2, py: { xs: 1.25, sm: 1.5 } }}
              >
                Add Warehouse
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<InventoryIcon />}
                component={Link}
                href="/stock/add"
                sx={{ borderRadius: 2, py: { xs: 1.25, sm: 1.5 } }}
              >
                Update Stock
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<TrendingUpIcon />}
                component={Link}
                href="/transfers/add"
                sx={{ borderRadius: 2, py: { xs: 1.25, sm: 1.5 } }}
              >
                Transfer Stock
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
