import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlarmSeverity } from '../value-objects/alarm-severity';
import { Alarm } from '../alarm';
import { AlarmItem } from '../alarm-item';

@Injectable()
export class AlarmFactory {
  create(
    name: string,
    severity: string,
    triggeredAt: Date,
    items: Array<{ name: string; type: string }>,
  ) {
    const alarmId = randomUUID();
    const alarmSeverity = new AlarmSeverity(severity as AlarmSeverity['value']);
    const newAlarm = new Alarm(alarmId);
    newAlarm.name = name;
    newAlarm.severity = alarmSeverity;
    newAlarm.triggeredAt = triggeredAt;
    newAlarm.isAcknowledged = false;

    items
      .map((item) => new AlarmItem(randomUUID(), item.name, item.type))
      .forEach((item) => newAlarm.addAlarmItem(item));

    return newAlarm;
  }
}
