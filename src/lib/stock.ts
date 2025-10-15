import { api, parseOrThrow } from "./api";
import {
  stockSchema,
  stocksSchema,
  type Stock,
  type StockFormInput,
} from "../types";

export async function getStock(): Promise<Stock[]> {
  const { data } = await api.get("/api/stock");
  return parseOrThrow(stocksSchema, data);
}

export async function getStockItem(id: number): Promise<Stock> {
  const { data } = await api.get(`/api/stock/${id}`);
  return parseOrThrow(stockSchema, data);
}

export async function createStock(payload: StockFormInput): Promise<Stock> {
  const { data } = await api.post("/api/stock", payload);
  return parseOrThrow(stockSchema, data);
}

export async function updateStock(
  id: number,
  payload: StockFormInput
): Promise<Stock> {
  const { data } = await api.put(`/api/stock/${id}`, payload);
  return parseOrThrow(stockSchema, data);
}

export async function deleteStock(id: number): Promise<void> {
  await api.delete(`/api/stock/${id}`);
}
