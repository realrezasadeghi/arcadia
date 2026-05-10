/**
 * Cookie Utilities — جایگزین localStorage برای توکن‌ها
 *
 * توکن‌ها در cookie ذخیره می‌شوند تا:
 * - middleware بتواند server-side بخواند (is_authenticated)
 * - در SSR نیز accessible باشند
 *
 * توجه: چون از JS تنظیم می‌شوند httpOnly نیستند.
 * برای امنیت بیشتر باید از یک BFF یا Next.js API Route استفاده شود.
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const AUTH_FLAG_KEY = "is_authenticated";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 روز

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Strict${secure}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function persistTokens(accessToken: string, refreshToken: string): void {
  setCookie(ACCESS_TOKEN_KEY, accessToken, TOKEN_MAX_AGE);
  setCookie(REFRESH_TOKEN_KEY, refreshToken, TOKEN_MAX_AGE);
  setCookie(AUTH_FLAG_KEY, "1", TOKEN_MAX_AGE);
}

export function clearAuthCookies(): void {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  deleteCookie(AUTH_FLAG_KEY);
}

export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY);
}
