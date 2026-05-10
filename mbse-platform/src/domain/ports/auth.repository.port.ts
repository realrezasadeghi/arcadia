import type { User, AuthTokens, LoginInput, RegisterInput } from "../entities/user.entity";

export interface IAuthRepository {
  login(input: LoginInput): Promise<{ user: User; tokens: AuthTokens }>;
  register(input: RegisterInput): Promise<{ user: User; tokens: AuthTokens }>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthTokens>;
  getCurrentUser(): Promise<User>;
}
