import { Grid } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WarningIcon from "@mui/icons-material/Warning";
import { Product, Warehouse } from "../../types";
import MetricCard from "./MetricCard";

type MetricsPropTypes = {
  products: Product[];
  warehouses: Warehouse[];
  totalValue: number;
  activeAlerts?: number;
};

function Metrics({
  products,
  warehouses,
  totalValue,
  activeAlerts = 0,
}: MetricsPropTypes) {
  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          icon={<CategoryIcon />}
          color="primary"
          value={products.length}
          label="Total Products"
          progress={products.length}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          icon={<WarehouseIcon />}
          color="info"
          value={warehouses.length}
          label="Warehouses"
          progress={warehouses.length * 10}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          icon={<InventoryIcon />}
          color="success"
          value={`$${totalValue.toLocaleString()}`}
          label="Total Inventory Value"
          progress={totalValue / 1000}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          icon={<WarningIcon />}
          color="warning"
          value={activeAlerts}
          label="Active Alerts"
          progress={(activeAlerts / Math.max(products.length, 1)) * 100}
        />
      </Grid>
    </Grid>
  );
}

export default Metrics;
