/**
 * HttpClient — Native fetch wrapper
 *
 * از fetch استفاده می‌کند تا:
 * - با Next.js App Router cache (revalidate / tags) سازگار باشد
 * - بدون dependency خارجی باشد
 * - در Server Components و Client Components هر دو کار کند
 *
 * Token Refresh: در صورت 401، یک بار با refresh_token تلاش می‌شود.
 * اگر refresh هم ناموفق بود → redirect به /login.
 */

export interface FetchOptions extends Omit<RequestInit, "body"> {
  /** Next.js ISR: چند ثانیه cache شود */
  revalidate?: number | false;
  /** Next.js cache tags برای revalidatePath / revalidateTag */
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

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

export function persistTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
  // Cookie برای Middleware — non-httpOnly، فقط presence check
  document.cookie = `is_authenticated=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  document.cookie = "is_authenticated=; path=/; max-age=0";
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

/** یک بار تلاش برای refresh کردن access token */
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
    } catch {
      return false;
    } finally {
      _isRefreshing = false;
      _refreshPromise = null;
    }
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
    ...restOptions,
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...(nextConfig ? { next: nextConfig } : {}),
  });

  // 401 — یک بار refresh امتحان کن، سپس retry
  if (response.status === 401 && typeof window !== "undefined" && !isRetry) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      return request<T>(path, options, true);
    }
    // refresh هم ناموفق بود → logout
    clearTokens();
    window.location.href = "/login";
    throw new HttpError(401, "نشست منقضی شده — لطفاً دوباره وارد شوید");
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

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
