import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouse,
  getWarehouses,
  updateWarehouse,
} from "../lib/warehouses";
import type { WarehouseFormInput } from "../types";

export function useWarehouses() {
  const { data, isPending, error } = useQuery({
    queryKey: ["warehouses"],
    queryFn: getWarehouses,
  });
  return { data, isPending, error };
}

export function useWarehouse(warehouseId?: number) {
  const { data, isPending, error } = useQuery({
    queryKey: ["warehouses", warehouseId],
    queryFn: () => getWarehouse(warehouseId!),
    enabled: !!warehouseId,
  });
  return { data, isPending, error };
}

export function useCreateWarehouse() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: WarehouseFormInput) => createWarehouse(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}

export function useUpdateWarehouse(warehouseId: number) {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: WarehouseFormInput) =>
      updateWarehouse(warehouseId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: number) => deleteWarehouse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}
