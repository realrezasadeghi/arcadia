import { persistTokens, clearAuthCookies, getAccessToken, getRefreshToken } from "@/lib/cookies";

export interface FetchOptions extends Omit<RequestInit, "body"> {
  revalidate?: number | false;
  tags?: string[];
}

interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "HttpError";
    Object.setPrototypeOf(this, HttpError.prototype);
  }
  get isUnauthorized(): boolean { return this.statusCode === 401; }
  get isForbidden(): boolean { return this.statusCode === 403; }
  get isNotFound(): boolean { return this.statusCode === 404; }
  get isValidationError(): boolean { return this.statusCode === 422; }
}

// re-export برای استفاده در auth.repository
export { persistTokens, clearAuthCookies as clearTokens };

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
}

function buildNextConfig(options: FetchOptions): RequestInit["next"] {
  if (options.revalidate !== undefined || options.tags) {
    return { revalidate: options.revalidate, tags: options.tags };
  }
  return undefined;
}

async function parseError(response: Response): Promise<HttpError> {
  try {
    const body = (await response.json()) as ApiError;
    return new HttpError(response.status, body.message ?? response.statusText, body.errors);
  } catch {
    return new HttpError(response.status, response.statusText);
  }
}

let _isRefreshing = false;
let _refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  if (_isRefreshing) return _refreshPromise!;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  _isRefreshing = true;
  _refreshPromise = (async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { accessToken: string; refreshToken: string };
      persistTokens(data.accessToken, data.refreshToken);
      return true;
    } catch { return false; }
    finally { _isRefreshing = false; _refreshPromise = null; }
  })();
  return _refreshPromise;
}

async function request<T>(
  path: string,
  options: FetchOptions & { method: string; body?: unknown },
  isRetry = false,
): Promise<T> {
  const { revalidate, tags, body, method, ...restOptions } = options;
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(restOptions.headers as Record<string, string> | undefined),
  };
  const nextConfig = buildNextConfig({ revalidate, tags });
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...restOptions, method, headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...(nextConfig ? { next: nextConfig } : {}),
  });

  if (response.status === 401 && typeof window !== "undefined" && !isRetry) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) return request<T>(path, options, true);
    clearAuthCookies();
    window.location.href = "/login";
    throw new HttpError(401, "نشست منقضی شده");
  }
  if (!response.ok) throw await parseError(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const httpClient = {
  get<T>(path: string, options?: FetchOptions): Promise<T> {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return request<T>(path, { ...options, method: "POST", body });
  },
  put<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return request<T>(path, { ...options, method: "PUT", body });
  },
  patch<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return request<T>(path, { ...options, method: "PATCH", body });
  },
  delete<T>(path: string, options?: FetchOptions): Promise<T> {
    return request<T>(path, { ...options, method: "DELETE" });
  },
} as const;
