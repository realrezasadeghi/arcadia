import type { IAuthRepository } from "@/domain/ports/auth.repository.port";
import { User, type AuthTokens } from "@/domain/entities/user.entity";
import { httpClient, persistTokens, clearTokens } from "../http/http-client";

interface UserRaw {
  id: string; email: string; name: string;
  avatarUrl?: string | null; createdAt: string;
}

interface AuthResponseRaw {
  user: UserRaw;
  tokens: { accessToken: string; refreshToken: string };
}

export class AuthRepository implements IAuthRepository {
  async login(input: { email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }> {
    const raw = await httpClient.post<AuthResponseRaw>("/auth/login", input);
    persistTokens(raw.tokens.accessToken, raw.tokens.refreshToken);
    const tokens: AuthTokens = { accessToken: raw.tokens.accessToken, refreshToken: raw.tokens.refreshToken };
    return { user: User.reconstitute(raw.user), tokens };
  }

  async register(input: { name: string; email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }> {
    const raw = await httpClient.post<AuthResponseRaw>("/auth/register", input);
    persistTokens(raw.tokens.accessToken, raw.tokens.refreshToken);
    const tokens: AuthTokens = { accessToken: raw.tokens.accessToken, refreshToken: raw.tokens.refreshToken };
    return { user: User.reconstitute(raw.user), tokens };
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post("/auth/logout");
    } finally {
      clearTokens();
    }
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    const raw = await httpClient.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", { refreshToken: token });
    persistTokens(raw.accessToken, raw.refreshToken);
    return { accessToken: raw.accessToken, refreshToken: raw.refreshToken };
  }

  async getCurrentUser(): Promise<User> {
    const raw = await httpClient.get<UserRaw>("/auth/me");
    return User.reconstitute(raw);
  }
}

export const authRepository = new AuthRepository();
