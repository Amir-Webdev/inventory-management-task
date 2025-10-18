import { z } from "zod";
import logger from "./logger";

export function checkParseError<T>(
  parsed: z.ZodSafeParseSuccess<T> | z.ZodSafeParseError<T>
) {
  if (!parsed.success) {
    logger(parsed);
    throw new Error("Validation error");
  }
}
