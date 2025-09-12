import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAlarmRepository } from 'src/alarms/application/ports/create-alarm.repository';
import { AlarmEntity } from '../entities/alarm.entity';
import { Repository } from 'typeorm';
import { Alarm } from 'src/alarms/domain/alarm';
import { AlarmMapper } from '../mapper/alarm.mapper';

@Injectable()
export class OrmCreateAlarmRepository implements CreateAlarmRepository {
  constructor(
    @InjectRepository(AlarmEntity)
    private readonly alarmRepository: Repository<AlarmEntity>,
  ) {}

  async save(alarm: Alarm): Promise<Alarm> {
    const alarmEntity = AlarmMapper.toPersistence(alarm);
    const savedEntity = await this.alarmRepository.save(alarmEntity);
    return AlarmMapper.toDomain(savedEntity);
  }
}
