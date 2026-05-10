import type { User, AuthTokens } from "../entities/user.entity";

export interface IAuthRepository {
  login(input: { email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }>;
  register(input: { name: string; email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthTokens>;
  getCurrentUser(): Promise<User>;
}
