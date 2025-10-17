import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Link from "next/link";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function QuickActions() {
  return (
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
  );
}

export default QuickActions;
