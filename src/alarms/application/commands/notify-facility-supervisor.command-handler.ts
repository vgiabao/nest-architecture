import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyFacilitySupervisorCommand } from './notify-facility-supervisor.command';
import { Logger } from '@nestjs/common';

@CommandHandler(NotifyFacilitySupervisorCommand)
export class NotifyFacilitySupervisorCommandHandler
  implements ICommandHandler<NotifyFacilitySupervisorCommand>
{
  private logger = new Logger(NotifyFacilitySupervisorCommandHandler.name);
  constructor() {
    this.logger.debug('NotifyFacilitySupervisorCommandHandler initialized');
  }
  async execute(command: NotifyFacilitySupervisorCommand): Promise<void> {
    this.logger.debug(
      `Notifying facility supervisor for facility ${JSON.stringify(command)}`,
    );
    // TODO: send email or SMS to facility supervisor
  }
}
