import type { IAuthRepository } from "@/domain/ports/auth.repository.port";
import type { User, AuthTokens } from "@/domain/entities/user.entity";
import { Email } from "@/domain/value-objects/email.vo";
import { DomainError } from "@/domain/errors/domain.error";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterOutput {
  user: User;
  tokens: AuthTokens;
}

/**
 * RegisterUseCase
 *
 * Business rules:
 * 1. نام باید حداقل ۳ کاراکتر باشد
 * 2. ایمیل باید فرمت معتبر داشته باشد (Email VO)
 * 3. رمز عبور باید حداقل ۶ کاراکتر باشد
 */
export class RegisterUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const name = input.name.trim();
    if (!name || name.length < 3) {
      throw new DomainError("نام باید حداقل ۳ کاراکتر باشد");
    }

    const email = Email.create(input.email);

    if (!input.password || input.password.length < 6) {
      throw new DomainError("رمز عبور باید حداقل ۶ کاراکتر باشد");
    }

    return this.repository.register({ name, email: email.value, password: input.password });
  }
}
