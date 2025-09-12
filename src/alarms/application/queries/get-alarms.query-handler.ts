import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAlarmsQuery } from './get-alarms.query';
import { FindAlarmRepository } from '../ports/find-alarm.repository';
import { Alarm } from 'src/alarms/domain/alarm';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

@QueryHandler(GetAlarmsQuery)
export class GetAlarmsQueryHandler
  implements IQueryHandler<GetAlarmsQuery, AlarmReadModel[]>
{
  constructor(private readonly findAlarmRepository: FindAlarmRepository) {
    console.log('GetAlarmsQueryHandler initialized');
  }

  async execute(query: GetAlarmsQuery): Promise<AlarmReadModel[]> {
    return this.findAlarmRepository.findAll();
  }
}
