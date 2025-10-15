import { z } from "zod";

// Domain Schemas
export const productSchema = z.object({
  id: z.int().positive(),
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  unitCost: z.number().nonnegative(),
  reorderPoint: z.int().nonnegative(),
});

export const warehouseSchema = z.object({
  id: z.int().positive(),
  name: z.string().min(1),
  location: z.string().min(1),
  code: z.string().min(1),
});

export const stockSchema = z.object({
  id: z.int().positive(),
  productId: z.int().positive(),
  warehouseId: z.int().positive(),
  quantity: z.int().nonnegative(),
});

export const inventoryOverviewSchema = productSchema.extend({
  totalQuantity: z.int().nonnegative(),
  isLowStock: z.boolean(),
});

// Form Schemas
export const productFormSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  unitCost: z.coerce.number().nonnegative("Must be >= 0"),
  reorderPoint: z.coerce.number().int().nonnegative("Must be >= 0"),
});
export type ProductFormInput = z.infer<typeof productFormSchema>;

export const warehouseFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
});
export type WarehouseFormInput = z.infer<typeof warehouseFormSchema>;

export const stockFormSchema = z.object({
  productId: z.coerce.number().int().positive(),
  warehouseId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().nonnegative(),
});
export type StockFormInput = z.infer<typeof stockFormSchema>;

// Types from domain schemas
export type Product = z.infer<typeof productSchema>;
export type Warehouse = z.infer<typeof warehouseSchema>;
export type Stock = z.infer<typeof stockSchema>;
export type InventoryOverview = z.infer<typeof inventoryOverviewSchema>;

// Response Schemas
export const productsSchema = z.array(productSchema);
export const warehousesSchema = z.array(warehouseSchema);
export const stocksSchema = z.array(stockSchema);
