import axios from "axios";
import { ZodSchema } from "zod";

export const api = axios.create({
  baseURL: "",
});

export function parseOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    // For visibility in dev
    console.error("Zod parse error:", parsed.error.flatten());
    throw new Error("Invalid response shape");
  }
  return parsed.data;
}

