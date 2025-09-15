import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { Version } from './value-objects/version';
import { SerializableEvent } from './interfaces/serializable-event';

const VERSION = Symbol('version');

export class VersionedAggregateRoot extends AggregateRoot {
  public id: string;

  private [VERSION] = new Version(0);

  get version() {
    return this[VERSION];
  }

  loadFromHistory(history: SerializableEvent[]): void {
    if (history.length === 0) {
      // No events to load, keep version at 0
      return;
    }

    const domainEvents = history.map((event) => event.data);
    super.loadFromHistory(domainEvents);
    const lastEvent = history[history.length - 1];
    this.setVersion(new Version(lastEvent.position));
  }

  private setVersion(version: Version) {
    this[VERSION] = version;
  }
}
