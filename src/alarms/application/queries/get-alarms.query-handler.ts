import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAlarmsQuery } from './get-alarms.query';
import { AlarmRepository } from '../ports/alarm.repository';
import { Alarm } from 'src/alarms/domain/alarm';

@QueryHandler(GetAlarmsQuery)
export class GetAlarmsQueryHandler
  implements IQueryHandler<GetAlarmsQuery, Alarm[]>
{
  constructor(private readonly alarmRepository: AlarmRepository) {
    console.log('GetAlarmsQueryHandler initialized');
  }

  async execute(query: GetAlarmsQuery): Promise<Alarm[]> {
    return this.alarmRepository.findAll();
  }
}
