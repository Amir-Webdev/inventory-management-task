import { api, parseOrThrow } from "./api";
import {
  productSchema,
  productsSchema,
  type Product,
  type ProductFormInput,
} from "../types";

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get("/api/products");
  return parseOrThrow(productsSchema, data);
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get(`/api/products/${id}`);
  return parseOrThrow(productSchema, data);
}

export async function createProduct(
  payload: ProductFormInput
): Promise<Product> {
  const { data } = await api.post("/api/products", payload);
  return parseOrThrow(productSchema, data);
}

export async function updateProduct(
  id: number,
  payload: ProductFormInput
): Promise<Product> {
  const { data } = await api.put(`/api/products/${id}`, payload);
  return parseOrThrow(productSchema, data);
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/api/products/${id}`);
}
