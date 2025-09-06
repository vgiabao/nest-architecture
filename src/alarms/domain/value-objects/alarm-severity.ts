export class AlarmSeverity {
  constructor(public value: 'low' | 'medium' | 'high') {}

  equals(severity: AlarmSeverity) {
    return this.value === severity.value;
  }
}
