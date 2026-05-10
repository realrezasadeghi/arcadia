import { Entity } from "../shared/entity.base";
import { Email } from "../value-objects/email.vo";
import { DomainError } from "../errors/domain.error";

interface UserProps {
  email: Email;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * User — Entity
 *
 * موجودیت کاربر با encapsulation کامل.
 * Email به‌عنوان Value Object — validation و normalization خودکار دارد.
 */
export class User extends Entity<string> {
  private _name: string;
  private _email: Email;
  private _avatarUrl: string | null;
  readonly createdAt: Date;

  private constructor(id: string, props: UserProps) {
    super(id);
    this._email = props.email;
    this._name = props.name;
    this._avatarUrl = props.avatarUrl;
    this.createdAt = props.createdAt;
  }

  static create(props: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }): User {
    if (!props.name.trim()) throw new DomainError("نام کاربر الزامی است");
    return new User(props.id, {
      email: Email.create(props.email),
      name: props.name.trim(),
      avatarUrl: props.avatarUrl ?? null,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string | null;
    createdAt: string;
  }): User {
    return new User(props.id, {
      email: Email.create(props.email),
      name: props.name,
      avatarUrl: props.avatarUrl ?? null,
      createdAt: new Date(props.createdAt),
    });
  }

  get email(): Email { return this._email; }
  get name(): string { return this._name; }
  get avatarUrl(): string | null { return this._avatarUrl; }

  changeName(name: string): void {
    if (!name.trim()) throw new DomainError("نام کاربر نمی‌تواند خالی باشد");
    this._name = name.trim();
  }

  changeAvatar(url: string | null): void {
    this._avatarUrl = url;
  }

  get initials(): string {
    return this._name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  toJSON() {
    return {
      id: this._id,
      email: this._email.value,
      name: this._name,
      avatarUrl: this._avatarUrl,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
