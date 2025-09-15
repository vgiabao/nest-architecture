import { Injectable, Type } from '@nestjs/common';
import { SerializableEvent } from 'src/shared/domain/interfaces/serializable-event';
import { Event } from '../schemas/event.schema';
import { EventClsRegistry } from '../event-cls.registry';

@Injectable()
export class EventDeserializer {
  deserialize<T>(event: Event): SerializableEvent<T> {
    const eventClass = this.getEventClassByType(event.type)!;

    return {
      ...event,
      data: this.instantiateSerializedEvent(eventClass, event.data),
    };
  }

  getEventClassByType(type: string) {
    return EventClsRegistry.get(type);
  }

  instantiateSerializedEvent<T extends Type>(
    EventClass: T,
    data: Record<string, any>,
  ) {
    return Object.assign(Object.create(EventClass.prototype), data);
  }
}
