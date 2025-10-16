import { api, parseOrThrow } from "./api";
import { alertSchema, alertsSchema, type Alert } from "../types";

export async function getAlerts(): Promise<Alert[]> {
  const { data } = await api.get("/api/alerts");
  return parseOrThrow(alertsSchema, data);
}

export async function getAlert(id: number): Promise<Alert> {
  const { data } = await api.get(`/api/alerts/${id}`);
  return parseOrThrow(alertSchema, data);
}

export type CreateAlertInput = Omit<Alert, "id" | "createdAt" | "updatedAt">;

export async function createAlert(payload: CreateAlertInput): Promise<Alert> {
  const { data } = await api.post("/api/alerts", payload);
  return parseOrThrow(alertSchema, data);
}

export async function updateAlert(
  id: number,
  payload: Partial<CreateAlertInput>
): Promise<Alert> {
  const { data } = await api.put(`/api/alerts/${id}`, payload);
  return parseOrThrow(alertSchema, data);
}

export async function deleteAlert(id: number): Promise<void> {
  await api.delete(`/api/alerts/${id}`);
}
