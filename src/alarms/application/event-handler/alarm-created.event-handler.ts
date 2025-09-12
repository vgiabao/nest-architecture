import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AlarmCreatedEvent } from 'src/alarms/domain/events/alarm-created.events';
import { UpsertMaterializedAlarmRepository } from '../ports/upsert-materialized-alarm.repository';

@EventsHandler(AlarmCreatedEvent)
export class AlarmCreatedEventHandler
  implements IEventHandler<AlarmCreatedEvent>
{
  private readonly logger = new Logger(AlarmCreatedEventHandler.name);

  constructor(
    private readonly upsertMaterializedAlarmRepository: UpsertMaterializedAlarmRepository,
  ) {}

  // In a real-world application, we would have to ensure that this operation is atomic
  // with the creation of the alarm. Otherwise, we could end up with an alarm that is not reflected
  // in the read model (e.g. because the database operation fails).
  // For more information, check out "Transactional inbox/outbox pattern".

  handle(event: AlarmCreatedEvent) {
    this.logger.log(`Handling AlarmCreatedEvent: ${JSON.stringify(event)}`);
    const { alarm } = event;
    const { id, name, severity, triggeredAt, items } = alarm;

    this.upsertMaterializedAlarmRepository.upsert({
      id,
      name,
      severity: severity.value,
      triggeredAt,
      items: items,
    });
  }
}
