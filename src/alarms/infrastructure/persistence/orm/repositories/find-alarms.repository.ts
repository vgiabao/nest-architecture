import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FindAlarmRepository } from 'src/alarms/application/ports/find-alarm.repository';
import { Repository } from 'typeorm';
import { MaterializedAlarmView } from '../schemas/materialized-alarm-view.schema';
import { Model } from 'mongoose';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

@Injectable()
export class OrmFindAlarmsRepository implements FindAlarmRepository {
  constructor(
    @InjectModel(MaterializedAlarmView.name)
    private readonly materializedAlarmViewModel: Model<MaterializedAlarmView>,
  ) {}
  async findAll(): Promise<AlarmReadModel[]> {
    return await this.materializedAlarmViewModel.find();
  }
}
