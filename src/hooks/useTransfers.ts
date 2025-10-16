import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransfer, deleteTransfer, getTransfers } from "../lib/transfers";
import { TransferFormInput } from "../types";

export function useTransfers() {
  const { data, isPending, error } = useQuery({
    queryFn: getTransfers,
    queryKey: ["transfers"],
  });
  return { data, isPending, error };
}

export function useCreateTransfer() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: TransferFormInput) => createTransfer(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transfers"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}

export function useDeleteTransfer() {
  const qc = useQueryClient();
  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: number) => deleteTransfer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transfers"] }),
  });
  return { mutate, mutateAsync, isPending, error };
}
