import { Module } from '@nestjs/common';
import { OrmAlarmPersistenceModule } from './persistence/orm/orm-persistence.module';
import { InMemoryAlarmPersistenceModule } from './persistence/in-memory/in-memory-persistence.module';

@Module({})
export class AlarmInfrastructureModule {
  static use(driver: 'in-memory' | 'orm') {
    const persistenceModule =
      driver === 'orm'
        ? OrmAlarmPersistenceModule
        : InMemoryAlarmPersistenceModule;
    return {
      module: AlarmInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
