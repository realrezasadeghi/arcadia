import type { IAuthRepository } from "@/domain/ports/auth.repository.port";
import type { User } from "@/domain/entities/user.entity";

/**
 * GetCurrentUserUseCase
 *
 * کاربر جلسه‌ی فعال را بازمی‌گرداند.
 * در صورت عدم احراز هویت، repository خطا پرتاب می‌کند.
 */
export class GetCurrentUserUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(): Promise<User> {
    return this.repository.getCurrentUser();
  }
}
