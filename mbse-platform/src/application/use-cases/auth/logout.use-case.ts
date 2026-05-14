import type { IAuthRepository } from "@/domain/ports/auth.repository.port";

/**
 * LogoutUseCase
 *
 * پاک‌سازی session کاربر.
 * Token revocation و حذف cookies از اینجا مدیریت می‌شود.
 */
export class LogoutUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(): Promise<void> {
    return this.repository.logout();
  }
}
