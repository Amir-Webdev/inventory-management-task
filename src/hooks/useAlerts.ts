import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAlert,
  deleteAlert,
  getAlert,
  getAlerts,
  updateAlert,
  type CreateAlertInput,
} from "../lib/alerts";

export function useAlerts() {
  const { data, isPending, error } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
  });
  return { data, isPending, error };
}

export function useAlert(alertId?: number) {
  const { data, isPending, error } = useQuery({
    queryKey: ["alerts", alertId],
    queryFn: () => getAlert(alertId!),
    enabled: !!alertId,
  });
  return { data, isPending, error };
}

export function useCreateAlert() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: CreateAlertInput) => createAlert(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}

export function useUpdateAlert(alertId: number) {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: Partial<CreateAlertInput>) =>
      updateAlert(alertId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}

export function useDeleteAlert() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: number) => deleteAlert(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}
