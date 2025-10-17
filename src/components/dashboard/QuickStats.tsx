import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type QuickStatsPropTypes = {
  lowStockProducts: number;
  totalStockItems: number;
  resolvedAlerts: number;
};

function QuickStats({
  lowStockProducts,
  totalStockItems,
  resolvedAlerts,
}: QuickStatsPropTypes) {
  return (
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
                <Typography variant="h6" fontWeight={600} color="text.primary">
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
                <Typography variant="h6" fontWeight={600} color="text.primary">
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
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Resolved Alerts
                </Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">
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
  );
}

export default QuickStats;
