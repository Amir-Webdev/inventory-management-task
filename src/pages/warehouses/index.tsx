import { useState } from "react";
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  AppBar,
  Toolbar,
  Box,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useWarehouses, useDeleteWarehouse } from "../../hooks/useWarehouses";

export default function Warehouses() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: warehouses = [], isPending } = useWarehouses();
  const { mutateAsync: deleteWarehouse, isPending: isDeleting } =
    useDeleteWarehouse();
  const [open, setOpen] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null
  );

  const handleClickOpen = (id: number) => {
    setSelectedWarehouseId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedWarehouseId(null);
  };

  const handleDelete = async () => {
    try {
      await deleteWarehouse(selectedWarehouseId!);
      handleClose();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Warehouses
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/warehouses/add"
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: "160px" },
          }}
        >
          Add Warehouse
        </Button>
      </Box>

      {/* Mobile Card Layout */}
      {isMobile ? (
        <Box>
          {(isPending || isDeleting) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">Loading...</Typography>
            </Box>
          )}

          {warehouses.map((warehouse) => (
            <Card key={warehouse.id} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {warehouse.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: {warehouse.code}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={warehouse.location}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>

                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <IconButton
                    color="primary"
                    component={Link}
                    href={`/warehouses/edit/${warehouse.id}`}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleClickOpen(warehouse.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}

          {warehouses.length === 0 && !isPending && !isDeleting && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No warehouses available.
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        /* Desktop Table Layout */
        <TableContainer
          component={Paper}
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
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(isPending || isDeleting) && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {warehouses.map((warehouse) => (
                <TableRow key={warehouse.id} hover>
                  <TableCell>{warehouse.code}</TableCell>
                  <TableCell>{warehouse.name}</TableCell>
                  <TableCell>{warehouse.location}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      component={Link}
                      href={`/warehouses/edit/${warehouse.id}`}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleClickOpen(warehouse.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {warehouses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No warehouses available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Warehouse</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this warehouse? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
