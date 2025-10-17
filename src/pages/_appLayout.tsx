import Link from "next/link";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Avatar,
  Badge,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from "@mui/icons-material/Inventory";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";

type Props = { children: ReactNode };

export default function AppLayout({ children }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const navItems = useMemo(
    () => [
      { href: "/", label: "Dashboard", icon: <HomeIcon /> },
      { href: "/products", label: "Products", icon: <CategoryIcon /> },
      { href: "/warehouses", label: "Warehouses", icon: <WarehouseIcon /> },
      { href: "/stock", label: "Stock Levels", icon: <Inventory2Icon /> },
      { href: "/transfers", label: "Transfers", icon: <TrendingUpIcon /> },
      { href: "/alerts", label: "Alerts", icon: <NotificationsIcon /> },
    ],
    []
  );

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            position: "relative",
            height: "100vh",
          },
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
              }}
            >
              <InventoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Inventory
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Management System
              </Typography>
            </Box>
          </Box>
          {isMobile && (
            <IconButton onClick={toggleDrawer} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Navigation */}
        <Box sx={{ flexGrow: 1, pt: 2 }}>
          <List sx={{ px: 2 }}>
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <ListItemButton
                  key={item.href}
                  component={Link}
                  href={item.href}
                  selected={isActive}
                  sx={{
                    mb: 0.5,
                    borderRadius: 2,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "primary.contrastText",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive
                        ? "primary.contrastText"
                        : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Sidebar Footer */}
        <Box sx={{ p: 3, borderTop: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "grey.300",
                width: 32,
                height: 32,
                fontSize: "0.875rem",
              }}
            >
              A
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrator
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!drawerOpen && (
                <IconButton
                  onClick={toggleDrawer}
                  sx={{ display: { lg: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h5" fontWeight={600} color="text.primary">
                {navItems.find((item) => item.href === router.pathname)
                  ?.label || "Dashboard"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Notifications">
                <IconButton>
                  <Badge color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "background.default",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
