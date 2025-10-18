import axios, { AxiosError } from "axios";
import { ZodSchema } from "zod";
import { checkParseError } from "./checkParseError";

export const api = axios.create({
  baseURL: "",
});

export function parseOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  const parsed = schema.safeParse(data);
  checkParseError(parsed);
  return parsed.data as T;
}

export function getErrorMessage(error: AxiosError): string {
  // Try to extract error message from response
  const responseData = error.response?.data as { message?: string };
  if (responseData?.message) {
    return responseData.message;
  }
  
  // Fallback to axios error message
  return error.message || "An unexpected error occurred";
}

