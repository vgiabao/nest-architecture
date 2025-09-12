import { Alarm } from 'src/alarms/domain/alarm';
import { AlarmEntity } from '../entities/alarm.entity';
import { AlarmSeverity } from 'src/alarms/domain/value-objects/alarm-severity';
import { AlarmItem } from 'src/alarms/domain/alarm-item';
import { AlarmItemEntity } from '../entities/alarm-item.entity';

export class AlarmMapper {
  static toDomain(alarmEntity: AlarmEntity): Alarm {
    const alarmSeverity = new AlarmSeverity(
      alarmEntity.severity as AlarmSeverity['value'],
    );
    const alarmModel = new Alarm(alarmEntity.id);
    alarmModel.name = alarmEntity.name;
    alarmModel.severity = alarmSeverity;
    alarmModel.triggeredAt = alarmEntity.triggeredAt;
    alarmModel.isAcknowledged = alarmEntity.isAcknowledged;
    alarmModel.items = alarmEntity.items.map(
      (item) => new AlarmItem(item.id, item.name, item.type),
    );
    return alarmModel;
  }

  static toPersistence(alarm: Alarm): AlarmEntity {
    const alarmEntity = new AlarmEntity();
    alarmEntity.id = alarm.id;
    alarmEntity.name = alarm.name;
    alarmEntity.severity = alarm.severity.value;
    alarmEntity.triggeredAt = alarm.triggeredAt;
    alarmEntity.isAcknowledged = alarm.isAcknowledged;
    alarmEntity.items = alarm.items.map((item) => {
      const alarmItemEntity = new AlarmItemEntity();
      alarmItemEntity.id = item.id;
      alarmItemEntity.name = item.name;
      alarmItemEntity.type = item.type;
      return alarmItemEntity;
    });
    return alarmEntity;
  }
}
