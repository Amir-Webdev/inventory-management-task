import { Box, Typography } from "@mui/material";

function WelcomeSection() {
  return (
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
        Monitor your inventory, track stock levels, and manage alerts from your
        dashboard.
      </Typography>
    </Box>
  );
}

export default WelcomeSection;
