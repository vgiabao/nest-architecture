import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcknowledgeAlarmCommand } from './acknowledge-alarm.command';
import { AggregateRehydrator } from 'src/shared/application/aggregate-rehydrator';
import { Logger } from '@nestjs/common';
import { Alarm } from '../../domain/alarm';

@CommandHandler(AcknowledgeAlarmCommand)
export class AcknowledgeAlarmCommandHandler
  implements ICommandHandler<AcknowledgeAlarmCommand>
{
  private readonly logger = new Logger(AcknowledgeAlarmCommandHandler.name);
  constructor(private readonly aggregateRehydrator: AggregateRehydrator) {}

  async execute(command: AcknowledgeAlarmCommand) {
    this.logger.debug(
      `Acknowledging alarm command: ${JSON.stringify(command)}`,
    );

    const alarm = await this.aggregateRehydrator.rehydrate(
      command.alarmId,
      Alarm,
    );
    alarm.acknowledge();
    alarm.commit();
    return alarm;
  }
}
