import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../lib/products";
import type { ProductFormInput } from "../types";

export function useProducts() {
  const { data, isPending, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  return { data, isPending, error };
}

export function useProduct(productId?: number) {
  const { data, isPending, error } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProduct(productId!),
    enabled: !!productId,
  });
  return { data, isPending, error };
}

export function useCreateProduct() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: ProductFormInput) => createProduct(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}

export function useUpdateProduct(productId: number) {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: ProductFormInput) =>
      updateProduct(productId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}
