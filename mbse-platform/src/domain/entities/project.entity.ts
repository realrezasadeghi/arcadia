import { AggregateRoot } from "../shared/aggregate-root.base";
import { ProjectName } from "../value-objects/project-name.vo";
import { DomainError } from "../errors/domain.error";

export type ProjectRole = "OWNER" | "EDITOR" | "VIEWER";

export interface ProjectMemberProps {
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
}

interface ProjectProps {
  name: ProjectName;
  description: string;
  ownerId: string;
  members: Map<string, ProjectMemberProps>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project — Aggregate Root
 *
 * کنترل کامل عضوگیری، دسترسی و تغییر نام پروژه.
 * تنها نقطه ورودی برای تغییر state پروژه.
 */
export class Project extends AggregateRoot<string> {
  private _name: ProjectName;
  private _description: string;
  private readonly _ownerId: string;
  private readonly _members: Map<string, ProjectMemberProps>;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ProjectProps) {
    super(id);
    this._name = props.name;
    this._description = props.description;
    this._ownerId = props.ownerId;
    this._members = props.members;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /** Factory: ساخت پروژه جدید */
  static create(props: {
    id: string;
    name: string;
    description: string;
    ownerId: string;
  }): Project {
    const name = ProjectName.create(props.name);
    const now = new Date();
    const members = new Map<string, ProjectMemberProps>();

    members.set(props.ownerId, {
      userId: props.ownerId,
      role: "OWNER",
      joinedAt: now,
    });

    return new Project(props.id, {
      name,
      description: props.description,
      ownerId: props.ownerId,
      members,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Factory: بازسازی از داده‌های ذخیره‌شده (از API) */
  static reconstitute(props: {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    members: Array<{ userId: string; role: ProjectRole; joinedAt: string }>;
    createdAt: string;
    updatedAt: string;
  }): Project {
    const members = new Map<string, ProjectMemberProps>();
    for (const m of props.members) {
      members.set(m.userId, {
        userId: m.userId,
        role: m.role,
        joinedAt: new Date(m.joinedAt),
      });
    }
    return new Project(props.id, {
      name: ProjectName.create(props.name),
      description: props.description,
      ownerId: props.ownerId,
      members,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  // ─── Getters ───────────────────────────────────────────────────────────────
  get name(): ProjectName { return this._name; }
  get description(): string { return this._description; }
  get ownerId(): string { return this._ownerId; }
  get updatedAt(): Date { return this._updatedAt; }

  get members(): ReadonlyArray<ProjectMemberProps> {
    return Array.from(this._members.values());
  }

  // ─── Business Methods ──────────────────────────────────────────────────────

  rename(newName: string): void {
    this._name = ProjectName.create(newName);
    this._touch();
  }

  updateDescription(description: string): void {
    this._description = description;
    this._touch();
  }

  addMember(userId: string, role: Exclude<ProjectRole, "OWNER">): void {
    if (this._members.has(userId)) {
      throw new DomainError("این کاربر قبلاً عضو پروژه است");
    }
    this._members.set(userId, { userId, role, joinedAt: new Date() });
    this._touch();
  }

  changeMemberRole(userId: string, newRole: Exclude<ProjectRole, "OWNER">): void {
    if (userId === this._ownerId) {
      throw new DomainError("نقش مالک پروژه قابل تغییر نیست");
    }
    const member = this._members.get(userId);
    if (!member) throw new DomainError("کاربر عضو این پروژه نیست");
    member.role = newRole;
    this._touch();
  }

  removeMember(userId: string): void {
    if (userId === this._ownerId) {
      throw new DomainError("مالک پروژه نمی‌تواند حذف شود");
    }
    if (!this._members.has(userId)) {
      throw new DomainError("کاربر عضو این پروژه نیست");
    }
    this._members.delete(userId);
    this._touch();
  }

  // ─── Access Control ────────────────────────────────────────────────────────

  canEdit(userId: string): boolean {
    const member = this._members.get(userId);
    return member?.role === "OWNER" || member?.role === "EDITOR";
  }

  canView(userId: string): boolean {
    return this._members.has(userId);
  }

  isOwner(userId: string): boolean {
    return this._ownerId === userId;
  }

  getMemberRole(userId: string): ProjectRole | null {
    return this._members.get(userId)?.role ?? null;
  }

  // ─── Serialization ─────────────────────────────────────────────────────────

  toJSON() {
    return {
      id: this._id,
      name: this._name.value,
      description: this._description,
      ownerId: this._ownerId,
      members: Array.from(this._members.values()).map((m) => ({
        userId: m.userId,
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
      })),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
