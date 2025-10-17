import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { Product } from "../../types";

type ProductsListPropTypes = {
  isLoading: boolean;
  products: Product[];
  onClickOpen: (id: number) => void;
};

function ProductsList({
  isLoading,
  onClickOpen,
  products,
}: ProductsListPropTypes) {
  return (
    <Box>
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      )}

      {products.map((product) => (
        <Card key={product.id} sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {product.sku}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              <Chip label={product.category} size="small" variant="outlined" />
              <Chip
                label={`$${product.unitCost.toFixed(2)}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Reorder: ${product.reorderPoint}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <IconButton
                color="primary"
                component={Link}
                href={`/products/edit/${product.id}`}
                size="small"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => onClickOpen(product.id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {products.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">No products available.</Typography>
        </Box>
      )}
    </Box>
  );
}

export default ProductsList;
