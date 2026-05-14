import type { IAuthRepository } from "@/domain/ports/auth.repository.port";
import type { User, AuthTokens } from "@/domain/entities/user.entity";
import { Email } from "@/domain/value-objects/email.vo";
import { DomainError } from "@/domain/errors/domain.error";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: User;
  tokens: AuthTokens;
}

/**
 * LoginUseCase
 *
 * Business rules:
 * 1. ایمیل باید فرمت معتبر داشته باشد (Email VO)
 * 2. رمز عبور نمی‌تواند خالی باشد و باید حداقل ۶ کاراکتر باشد
 */
export class LoginUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const email = Email.create(input.email);

    if (!input.password || input.password.length < 6) {
      throw new DomainError("رمز عبور باید حداقل ۶ کاراکتر باشد");
    }

    return this.repository.login({ email: email.value, password: input.password });
  }
}
