import { VersionedAggregateRoot } from 'src/shared/domain/aggregate-root';
import { AlarmItem } from './alarm-item';
import { AlarmSeverity } from './value-objects/alarm-severity';
import { AlarmAcknowledgedEvent } from './events/alarm-acknowledged.event';
import { SerializedEventPayload } from 'src/shared/domain/interfaces/serializable-event';
import { AlarmCreatedEvent } from './events/alarm-created.event';

export class Alarm extends VersionedAggregateRoot {
  public name: string;
  public severity: AlarmSeverity;
  public triggeredAt: Date;
  public isAcknowledged: boolean;
  public items = new Array<AlarmItem>();
  constructor(public id: string) {
    super();
  }

  acknowledge() {
    this.apply(new AlarmAcknowledgedEvent(this.id));
  }

  addAlarmItem(item: AlarmItem) {
    this.items.push(item);
  }

  [`on${AlarmCreatedEvent.name}`](
    event: SerializedEventPayload<AlarmCreatedEvent>,
  ) {
    const { name, severity, triggeredAt, items } = event.alarm;
    this.name = name;
    this.severity = new AlarmSeverity(severity);
    this.triggeredAt = new Date(triggeredAt);
    this.items = items.map(
      (item) => new AlarmItem(item.id, item.name, item.type),
    );
    this.isAcknowledged = false;
  }

  [`on${AlarmAcknowledgedEvent.name}`](
    event: SerializedEventPayload<AlarmAcknowledgedEvent>,
  ) {
    if (this.isAcknowledged) {
      throw new Error('Alarm already acknowledged');
    }

    this.isAcknowledged = true;
  }
}
