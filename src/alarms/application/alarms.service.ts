import { Injectable } from '@nestjs/common';
import { CreateAlarmCommand } from './commands/create-alarm.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAlarmsQuery } from './queries/get-alarms.query';

@Injectable()
export class AlarmsService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}
  create(createAlarmCommand: CreateAlarmCommand) {
    return this.commandBus.execute(createAlarmCommand);
  }

  findAll() {
    return this.queryBus.execute(new GetAlarmsQuery());
  }
}
