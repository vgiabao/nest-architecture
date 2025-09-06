import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AlarmRepository } from "src/alarms/application/ports/alarm.repository";
import { AlarmEntity } from "../entities/alarm.entity";
import { Repository } from "typeorm";
import { Alarm } from "src/alarms/domain/alarm";
import { AlarmMapper } from "../mapper/alarm.mapper";


@Injectable()

export class OrmAlarmRepository implements AlarmRepository {
    constructor(
        @InjectRepository(AlarmEntity)
        private readonly alarmRepository: Repository<AlarmEntity>
    ) {}

    async findAll(): Promise<Alarm[]> {
        const entities = await this.alarmRepository.find();
        return entities.map(entity => AlarmMapper.toDomain(entity));
    }

    async save(alarm: Alarm): Promise<Alarm> {
        const alarmEntity = AlarmMapper.toPersistence(alarm);
        const savedEntity = await this.alarmRepository.save(alarmEntity);
        return AlarmMapper.toDomain(savedEntity);
    }
}