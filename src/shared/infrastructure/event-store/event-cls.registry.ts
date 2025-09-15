import { Type } from '@nestjs/common';

export class EventClsRegistry {
  private static readonly eventClsMap = new Map<string, any>();

  static add(eventCls: Type<any>) {
    this.eventClsMap.set(eventCls.name, eventCls);
  }

  static get(eventName: string) {
    const eventCls = this.eventClsMap.get(eventName);
    if (!eventCls) {
      throw new Error(`Event class not found for event name: ${eventName}`);
    }
    return eventCls;
  }
}
