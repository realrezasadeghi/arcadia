import type { IAuthRepository } from "@/domain/ports/auth.repository.port";
import type { AuthTokens } from "@/domain/entities/user.entity";
import { User } from "@/domain/entities/user.entity";
import { persistTokens, clearAuthCookies } from "@/lib/cookies";
import { users, DEMO_USER, DEMO_PASSWORD, nextId } from "./in-memory-store";

const MOCK_ACCESS = "mock-access-token";
const MOCK_REFRESH = "mock-refresh-token";

export class InMemoryAuthRepository implements IAuthRepository {
  async login({ email, password }: { email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }> {
    await delay();
    const user = [...users.values()].find((u) => u.email.value === email.toLowerCase());
    if (!user || password !== DEMO_PASSWORD) {
      throw new Error("ایمیل یا رمز عبور اشتباه است");
    }
    persistTokens(MOCK_ACCESS, MOCK_REFRESH);
    return { user, tokens: { accessToken: MOCK_ACCESS, refreshToken: MOCK_REFRESH } };
  }

  async register({ name, email, password: _ }: { name: string; email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }> {
    await delay();
    const exists = [...users.values()].some((u) => u.email.value === email.toLowerCase());
    if (exists) throw new Error("این ایمیل قبلاً ثبت شده است");
    const user = User.reconstitute({ id: nextId("user"), email, name, avatarUrl: null, createdAt: new Date().toISOString() });
    users.set(user.id, user);
    persistTokens(MOCK_ACCESS, MOCK_REFRESH);
    return { user, tokens: { accessToken: MOCK_ACCESS, refreshToken: MOCK_REFRESH } };
  }

  async logout(): Promise<void> {
    await delay(100);
    clearAuthCookies();
  }

  async refreshToken(_token: string): Promise<AuthTokens> {
    persistTokens(MOCK_ACCESS, MOCK_REFRESH);
    return { accessToken: MOCK_ACCESS, refreshToken: MOCK_REFRESH };
  }

  async getCurrentUser(): Promise<User> {
    await delay(80);
    return DEMO_USER;
  }
}

function delay(ms = 150): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
