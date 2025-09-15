import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAlarmCommand } from './create-alarm.command';
import { Logger } from '@nestjs/common';
import { AlarmFactory } from 'src/alarms/domain/factories/alarm.factory';
import { CreateAlarmRepository } from '../ports/create-alarm.repository';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler
  implements ICommandHandler<CreateAlarmCommand>
{
  private readonly logger = new Logger(CreateAlarmCommandHandler.name);

  constructor(
    private readonly alarmFactory: AlarmFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly createAlarmRepository: CreateAlarmRepository,
  ) {}

  async execute(command: CreateAlarmCommand) {
    this.logger.debug(`Creating alarm command: ${JSON.stringify(command)}`);
    const { name, severity, triggeredAt, items } = command;
    const alarm = this.alarmFactory.create(name, severity, triggeredAt, items);
    await this.createAlarmRepository.save(alarm);
    this.eventPublisher.mergeObjectContext(alarm);
    alarm.commit();
    return alarm;
  }
}
