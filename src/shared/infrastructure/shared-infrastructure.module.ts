import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './event-store/schemas/event.schema';
import { EVENT_STORE_CONNECTION } from 'src/core/core.constant';
import { EventSerializer } from './event-store/serializers/event.serializer';
import { EventStorePublisher } from './event-store/publishers/event-store.publisher';
import { MongoEventStore } from './event-store/mongo-event-store';
import { EventDeserializer } from './event-store/deserializers/event.deserializer';
import { EventBridge } from './event-store/event-bridge';
import { EventStore } from '../application/ports/event-store';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Event.name, schema: EventSchema }],
      EVENT_STORE_CONNECTION,
    ),
  ],
  providers: [
    EventSerializer,
    EventStorePublisher,
    MongoEventStore,
    EventDeserializer,
    EventBridge,
    {
      provide: EventStore,
      useExisting: MongoEventStore,
    },
  ],
  exports: [EventStore],
})
export class SharedInfrastructureModule {}
