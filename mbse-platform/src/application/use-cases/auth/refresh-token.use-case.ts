import type { IAuthRepository } from "@/domain/ports/auth.repository.port";
import type { AuthTokens } from "@/domain/entities/user.entity";
import { DomainError } from "@/domain/errors/domain.error";

export interface RefreshTokenInput {
  refreshToken: string;
}

/**
 * RefreshTokenUseCase
 *
 * توکن دسترسی جدید را با استفاده از refresh token صادر می‌کند.
 * Business rule: refresh token نمی‌تواند خالی باشد.
 */
export class RefreshTokenUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(input: RefreshTokenInput): Promise<AuthTokens> {
    if (!input.refreshToken.trim()) {
      throw new DomainError("Refresh token الزامی است");
    }
    return this.repository.refreshToken(input.refreshToken);
  }
}
