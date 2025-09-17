import { Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import {
  EMPTY,
  filter,
  first,
  map,
  mergeMap,
  Observable,
  race,
  timer,
} from 'rxjs';
import { AlarmAcknowledgedEvent } from 'src/alarms/domain/events/alarm-acknowledged.event';
import { AlarmCreatedEvent } from 'src/alarms/domain/events/alarm-created.event';
import { NotifyFacilitySupervisorCommand } from '../commands/notify-facility-supervisor.command';

export class UnacknowledgedAlarmsSaga {
  private readonly logger = new Logger(UnacknowledgedAlarmsSaga.name);
  @Saga()
  start = (events$: Observable<any>): Observable<ICommand> => {
    const alarmAcknowledgeEvents$ = events$.pipe(
      ofType(AlarmAcknowledgedEvent),
    );
    const alarmCreatedEvents$ = events$.pipe(ofType(AlarmCreatedEvent));

    return alarmCreatedEvents$.pipe(
      mergeMap((alarmCreatedEvent) =>
        race(
          alarmAcknowledgeEvents$.pipe(
            filter(
              (acknowledgedEvent) =>
                acknowledgedEvent.alarmId === alarmCreatedEvent.alarm.id,
            ),
            first(),
            mergeMap(() => EMPTY),
          ),
          timer(15000).pipe(map(() => alarmCreatedEvent)),
        ),
      ),
      map((alarmCreatedEvent) => {
        this.logger.debug(
          `Alarm ${alarmCreatedEvent.alarm.id} was not acknowledged in 15 seconds`,
        );
        const facilityId = '12345'; // Replace with actual facility ID retrieval logic
        return new NotifyFacilitySupervisorCommand(facilityId, [
          alarmCreatedEvent.alarm.id,
        ]);
      }),
    );
  };
}
