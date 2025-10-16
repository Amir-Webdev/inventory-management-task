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

export const transferSchema = z.object({
  id: z.int().positive(),
  productId: z.int().positive(),
  quantity: z.int().nonnegative(),
  sendingWarehouseId: z.int().positive(),
  receivingWarehouseId: z.int().positive(),
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

export const transferFormSchema = z
  .object({
    productId: z.coerce.number().int().positive("Must be > 0"),
    quantity: z.coerce.number().int().nonnegative("Must be >= 0"),
    sendingWarehouseId: z.coerce.number().int().positive("Must be > 0"),
    receivingWarehouseId: z.coerce.number().int().positive("Must be > 0"),
  })
  .refine((data) => data.receivingWarehouseId !== data.sendingWarehouseId, {
    message: "Sending and receiving warehouses cannot be the same",
    path: ["receivingWarehouseId"],
  });
export type TransferFormInput = z.infer<typeof transferFormSchema>;

// Types from domain schemas
export type Product = z.infer<typeof productSchema>;
export type Warehouse = z.infer<typeof warehouseSchema>;
export type Stock = z.infer<typeof stockSchema>;
export type Transfer = z.infer<typeof transferSchema>;
export type InventoryOverview = z.infer<typeof inventoryOverviewSchema>;

// Response Schemas
export const productsSchema = z.array(productSchema);
export const warehousesSchema = z.array(warehouseSchema);
export const stocksSchema = z.array(stockSchema);
export const transfersSchema = z.array(transferSchema);
