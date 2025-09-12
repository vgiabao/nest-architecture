import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MaterializedAlarmView } from '../schemas/materialized-alarm-view.schema';
import { Model } from 'mongoose';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';
import { UpsertMaterializedAlarmRepository } from 'src/alarms/application/ports/upsert-materialized-alarm.repository';

@Injectable()
export class OrmUpsertMaterializedAlarmRepository
  implements UpsertMaterializedAlarmRepository
{
  constructor(
    @InjectModel(MaterializedAlarmView.name)
    private readonly materializedAlarmViewModel: Model<MaterializedAlarmView>,
  ) {}

  async upsert(
    alarm: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>,
  ): Promise<void> {
    await this.materializedAlarmViewModel.updateOne({ id: alarm.id }, alarm, {
      upsert: true,
    });
  }
}
