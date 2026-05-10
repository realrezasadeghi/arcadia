import { DomainEvent } from "../shared/domain-event.base";

export class ProjectCreatedEvent extends DomainEvent {
  constructor(
    readonly projectId: string,
    readonly projectName: string,
    readonly ownerId: string
  ) {
    super("ProjectCreated");
  }
}

export class ProjectMemberAddedEvent extends DomainEvent {
  constructor(
    readonly projectId: string,
    readonly userId: string,
    readonly role: string
  ) {
    super("ProjectMemberAdded");
  }
}

export class ProjectMemberRemovedEvent extends DomainEvent {
  constructor(
    readonly projectId: string,
    readonly userId: string
  ) {
    super("ProjectMemberRemoved");
  }
}
