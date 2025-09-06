import { Alarm } from '../../domain/alarm';

// can use interface here (but abstract class serves as injection token
// in nestjs and the interface would not available at run time  )
export abstract class AlarmRepository {
  abstract save(alarm: Alarm): Promise<Alarm>;
  abstract findAll(): Promise<Alarm[]>;
}
