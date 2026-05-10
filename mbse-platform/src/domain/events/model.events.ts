import { DomainEvent } from "../shared/domain-event.base";

export class ElementCreatedEvent extends DomainEvent {
  constructor(
    readonly elementId: string,
    readonly elementType: string,
    readonly modelId: string
  ) {
    super("ElementCreated");
  }
}

export class ElementsConnectedEvent extends DomainEvent {
  constructor(
    readonly relationshipId: string,
    readonly sourceElementId: string,
    readonly targetElementId: string,
    readonly relationshipType: string
  ) {
    super("ElementsConnected");
  }
}

export class TraceLinkCreatedEvent extends DomainEvent {
  constructor(
    readonly traceLinkId: string,
    readonly sourceElementId: string,
    readonly sourceLayer: string,
    readonly targetElementId: string,
    readonly targetLayer: string,
    readonly type: string
  ) {
    super("TraceLinkCreated");
  }
}
