import { AxiosError } from "axios";
import type { ApiErrorShape, WpError } from "@/types/api";

export class ApiError extends Error {
  status: number;
  code: string;
  raw?: unknown;

  constructor({ status, code, message, raw }: ApiErrorShape & { raw?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.raw = raw;
  }
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 0;
    const data = err.response?.data as Partial<WpError> | undefined;
    const code = data?.code ?? err.code ?? "request_failed";
    const message = data?.message ?? err.message ?? "Something went wrong";
    return new ApiError({ status, code, message, raw: err.response?.data });
  }

  if (err instanceof Error) {
    return new ApiError({ status: 0, code: "unknown_error", message: err.message, raw: err });
  }

  return new ApiError({
    status: 0,
    code: "unknown_error",
    message: "An unexpected error occurred",
    raw: err,
  });
}
