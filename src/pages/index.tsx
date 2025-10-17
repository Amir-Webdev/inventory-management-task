import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useProducts } from "../hooks/useProducts";
import { useWarehouses } from "../hooks/useWarehouses";
import { useStock } from "../hooks/useStock";
import { useAlerts } from "../hooks/useAlerts";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import Metrics from "../components/dashboard/Metrics";
import QuickStats from "../components/dashboard/QuickStats";
import QuickActions from "../components/dashboard/QuickActions";
import InventoryOverview from "../components/dashboard/InventoryOverview";
import { InventoryOverviewType } from "../types";

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
  const inventoryOverview: InventoryOverviewType[] = products.map((product) => {
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
      <WelcomeSection />

      {/* Key Metrics Cards */}
      <Metrics
        warehouses={warehouses}
        activeAlerts={activeAlerts}
        products={products}
        totalValue={totalValue}
      />

      {/* Quick Stats Row */}
      <QuickStats
        lowStockProducts={lowStockProducts}
        resolvedAlerts={resolvedAlerts}
        totalStockItems={totalStockItems}
      />

      {/* Inventory Overview Section */}
      <InventoryOverview
        data={inventoryOverview}
        isLoading={isLoading}
        isNarrow={isNarrow}
      />

      {/* Quick Actions */}
      <QuickActions />
    </Box>
  );
}
