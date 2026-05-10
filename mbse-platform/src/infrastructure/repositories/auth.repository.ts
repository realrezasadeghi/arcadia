import type { IAuthRepository } from "@/domain/ports/auth.repository.port";
import type {
  User,
  AuthTokens,
  LoginInput,
  RegisterInput,
} from "@/domain/entities/user.entity";
import { httpClient } from "../http/http-client";

export class AuthRepository implements IAuthRepository {
  async login(
    input: LoginInput
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await httpClient.post<{
      user: User;
      tokens: AuthTokens;
    }>("/auth/login", input);

    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", response.tokens.accessToken);
      localStorage.setItem("refresh_token", response.tokens.refreshToken);
    }

    return response;
  }

  async register(
    input: RegisterInput
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await httpClient.post<{
      user: User;
      tokens: AuthTokens;
    }>("/auth/register", input);

    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", response.tokens.accessToken);
      localStorage.setItem("refresh_token", response.tokens.refreshToken);
    }

    return response;
  }

  async logout(): Promise<void> {
    await httpClient.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    return httpClient.post<AuthTokens>("/auth/refresh", { refreshToken: token });
  }

  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>("/auth/me");
  }
}

export const authRepository = new AuthRepository();
