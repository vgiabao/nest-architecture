import { AlarmSeverity } from './value-objects/alarm-severity';

export class Alarm {
  constructor(
    public id: string,
    public time: string,
    public severity: AlarmSeverity,
  ) {}
}
