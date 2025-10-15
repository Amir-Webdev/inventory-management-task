import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStock,
  deleteStock,
  getStock,
  getStockItem,
  updateStock,
} from "../lib/stock";
import type { StockFormInput } from "../types";

export function useStock() {
  const { data, isPending, error } = useQuery({
    queryKey: ["stock"],
    queryFn: getStock,
  });
  return { data, isPending, error };
}

export function useStockItem(stockId?: number) {
  const { data, isPending, error } = useQuery({
    queryKey: ["stock", stockId],
    queryFn: () => getStockItem(stockId!),
    enabled: !!stockId,
  });
  return { data, isPending, error };
}

export function useCreateStock() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: StockFormInput) => createStock(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stock"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}

export function useUpdateStock(stockId: number) {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: StockFormInput) => updateStock(stockId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stock"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}

export function useDeleteStock() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: number) => deleteStock(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stock"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}
