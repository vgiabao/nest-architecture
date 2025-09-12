import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateAlarmCommand } from './create-alarm.command';
import { Logger } from '@nestjs/common';
import { CreateAlarmRepository } from '../ports/create-alarm.repository';
import { AlarmFactory } from 'src/alarms/domain/factories/alarm.factory';
import { AlarmCreatedEvent } from 'src/alarms/domain/events/alarm-created.events';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler
  implements ICommandHandler<CreateAlarmCommand>
{
  private readonly logger = new Logger(CreateAlarmCommandHandler.name);

  constructor(
    private readonly alarmRepository: CreateAlarmRepository,
    private readonly alarmFactory: AlarmFactory,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateAlarmCommand) {
    this.logger.debug(`Creating alarm command: ${JSON.stringify(command)}`);
    const { name, severity, triggeredAt, items } = command;
    const alarm = this.alarmFactory.create(name, severity, triggeredAt, items);
    const newAlarm = await this.alarmRepository.save(alarm);
    this.eventBus.publish(new AlarmCreatedEvent(newAlarm));
  }
}
