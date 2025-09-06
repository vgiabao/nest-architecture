import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AlarmRepository } from "src/alarms/application/ports/alarm.repository";
import { AlarmEntity } from "../entities/alarm.entity";
import { Repository } from "typeorm";
import { Alarm } from "src/alarms/domain/alarm";
import { AlarmMapper } from "../mapper/alarm.mapper";


@Injectable()

export class InMemoryAlarmRepository implements AlarmRepository {
    private readonly alarms = new Map<string, AlarmEntity>();
    constructor(
    ) {}

    async findAll(): Promise<Alarm[]> {
        return Array.from(this.alarms.values()).map(AlarmMapper.toDomain);
    }

    async save(alarm: Alarm): Promise<Alarm> {
        const entity = AlarmMapper.toPersistence(alarm);
        this.alarms.set(alarm.id, entity);
        const newEntity = this.alarms.get(entity.id)!;
        return AlarmMapper.toDomain(newEntity);
    }
}