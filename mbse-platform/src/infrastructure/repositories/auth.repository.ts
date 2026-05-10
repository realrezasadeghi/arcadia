import type { IAuthRepository } from "@/domain/ports/auth.repository.port";
import { User, type AuthTokens } from "@/domain/entities/user.entity";
import { httpClient } from "../http/http-client";

interface UserRaw {
  id: string; email: string; name: string;
  avatarUrl?: string | null; createdAt: string;
}

interface AuthResponseRaw {
  user: UserRaw;
  tokens: AuthTokens;
}

function persistTokens(tokens: AuthTokens): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", tokens.accessToken);
  localStorage.setItem("refresh_token", tokens.refreshToken);
}

function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export class AuthRepository implements IAuthRepository {
  async login(input: { email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }> {
    const raw = await httpClient.post<AuthResponseRaw>("/auth/login", input);
    persistTokens(raw.tokens);
    return { user: User.reconstitute(raw.user), tokens: raw.tokens };
  }

  async register(input: { name: string; email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }> {
    const raw = await httpClient.post<AuthResponseRaw>("/auth/register", input);
    persistTokens(raw.tokens);
    return { user: User.reconstitute(raw.user), tokens: raw.tokens };
  }

  async logout(): Promise<void> {
    await httpClient.post("/auth/logout");
    clearTokens();
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    const tokens = await httpClient.post<AuthTokens>("/auth/refresh", { refreshToken: token });
    persistTokens(tokens);
    return tokens;
  }

  async getCurrentUser(): Promise<User> {
    const raw = await httpClient.get<UserRaw>("/auth/me");
    return User.reconstitute(raw);
  }
}

export const authRepository = new AuthRepository();
