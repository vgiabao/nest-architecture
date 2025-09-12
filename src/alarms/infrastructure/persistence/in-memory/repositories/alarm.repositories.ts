import { Injectable } from '@nestjs/common';
import { CreateAlarmRepository } from 'src/alarms/application/ports/create-alarm.repository';
import { AlarmEntity } from '../entities/alarm.entity';
import { Alarm } from 'src/alarms/domain/alarm';
import { AlarmMapper } from '../mapper/alarm.mapper';
import { FindAlarmRepository } from 'src/alarms/application/ports/find-alarm.repository';
import { UpsertMaterializedAlarmRepository } from 'src/alarms/application/ports/upsert-materialized-alarm.repository';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

@Injectable()
export class InMemoryAlarmRepository
  implements
    CreateAlarmRepository,
    FindAlarmRepository,
    UpsertMaterializedAlarmRepository
{
  private readonly alarms = new Map<string, AlarmEntity>();
  private readonly materializedAlarmViews = new Map<string, AlarmReadModel>();
  constructor() {}

  async findAll(): Promise<AlarmReadModel[]> {
    return Array.from(this.materializedAlarmViews.values());
  }

  async upsert(
    alarm: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>,
  ): Promise<void> {
    if (this.materializedAlarmViews.has(alarm.id)) {
      this.materializedAlarmViews.set(alarm.id, {
        ...this.materializedAlarmViews.get(alarm.id)!,
        ...alarm,
      });
    }
    return;
  }

  async save(alarm: Alarm): Promise<Alarm> {
    const entity = AlarmMapper.toPersistence(alarm);
    this.alarms.set(alarm.id, entity);
    const newEntity = this.alarms.get(entity.id)!;
    return AlarmMapper.toDomain(newEntity);
  }
}
