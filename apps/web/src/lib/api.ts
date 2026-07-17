import type { ApiError } from "@recruiterai/contracts";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`/api/v1${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? ((await response.json()) as T | ApiError)
    : ({
        error: {
          code: "INVALID_API_RESPONSE",
          message: response.ok
            ? "The API returned an unsupported response"
            : `The API request failed with status ${response.status}`,
          requestId: response.headers.get("x-request-id") ?? "unknown",
        },
      } as ApiError);
  if (!response.ok) {
    const apiError = body as ApiError;
    throw new ApiRequestError(
      apiError.error?.message ?? "The request could not be completed",
      apiError.error?.code ?? "REQUEST_FAILED",
      response.status,
      apiError.error?.details,
    );
  }

  return body as T;
}
