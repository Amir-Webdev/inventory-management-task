import { api, parseOrThrow } from "./api";
import {
  warehouseSchema,
  warehousesSchema,
  type Warehouse,
  type WarehouseFormInput,
} from "../types";

export async function getWarehouses(): Promise<Warehouse[]> {
  const { data } = await api.get("/api/warehouses");
  return parseOrThrow(warehousesSchema, data);
}

export async function getWarehouse(id: number): Promise<Warehouse> {
  const { data } = await api.get(`/api/warehouses/${id}`);
  return parseOrThrow(warehouseSchema, data);
}

export async function createWarehouse(
  payload: WarehouseFormInput
): Promise<Warehouse> {
  const { data } = await api.post("/api/warehouses", payload);
  return parseOrThrow(warehouseSchema, data);
}

export async function updateWarehouse(
  id: number,
  payload: WarehouseFormInput
): Promise<Warehouse> {
  const { data } = await api.put(`/api/warehouses/${id}`, payload);
  return parseOrThrow(warehouseSchema, data);
}

export async function deleteWarehouse(id: number): Promise<void> {
  await api.delete(`/api/warehouses/${id}`);
}
