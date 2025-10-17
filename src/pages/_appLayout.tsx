import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from "@mui/icons-material/Inventory";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ReactNode, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";

type Props = { children: ReactNode };

export default function AppLayout({ children }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { href: "/", label: "Dashboard", icon: <HomeIcon /> },
      { href: "/products", label: "Products", icon: <CategoryIcon /> },
      { href: "/warehouses", label: "Warehouses", icon: <WarehouseIcon /> },
      { href: "/stock", label: "Stock Levels", icon: <Inventory2Icon /> },
      { href: "/alerts", label: "Alerts", icon: <NotificationsIcon /> },
    ],
    []
  );

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 1, display: { xs: "inline-flex", md: "none" } }}
              aria-label="open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management System
          </Typography>

          {/* Desktop navigation buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                color="inherit"
                component={Link}
                href={item.href}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          role="presentation"
          sx={{ width: 260 }}
          onClick={toggleDrawer(false)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2 }}>
            <InventoryIcon />
            <Typography variant="subtitle1" fontWeight={600}>
              Inventory Menu
            </Typography>
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.href} component={Link} href={item.href}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      {children}
    </>
  );
}
