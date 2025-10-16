import {
  Transfer,
  TransferFormInput,
  transferSchema,
  transfersSchema,
} from "../types";
import { api, parseOrThrow } from "./api";

export async function getTransfers(): Promise<Transfer[]> {
  const { data } = await api.get("/api/transfers");
  return parseOrThrow(transfersSchema, data);
}

export async function createTransfer(
  payload: TransferFormInput
): Promise<Transfer> {
  const { data } = await api.post("/api/transfers", payload);
  return parseOrThrow(transferSchema, data);
}

export async function deleteTransfer(id: number): Promise<void> {
  await api.delete(`/api/transfers/${id}`);
}
