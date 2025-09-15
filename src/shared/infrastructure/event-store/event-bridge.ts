import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENT_STORE_CONNECTION } from 'src/core/core.constant';
import { ChangeStream, ChangeStreamInsertDocument } from 'mongodb';
import { EventDocument } from './schemas/event.schema';
import { EventDeserializer } from './deserializers/event.deserializer';
import { EventBus } from '@nestjs/cqrs';

export class EventBridge
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private changeStream: ChangeStream;
  constructor(
    @InjectModel(Event.name, EVENT_STORE_CONNECTION)
    private readonly eventStore: Model<Event>,
    private readonly eventDeserializer: EventDeserializer,
    private readonly eventBus: EventBus,
  ) {}

  onApplicationBootstrap() {
    this.changeStream = this.eventStore
      .watch()
      .on('change', (change: ChangeStreamInsertDocument<EventDocument>) => {
        if (change.operationType === 'insert') {
          this.handleEventStoreChange(change);
        }
      });
  }

  onApplicationShutdown() {
    this.changeStream.close();
  }

  private handleEventStoreChange(
    change: ChangeStreamInsertDocument<EventDocument>,
  ) {
    // Handle the change event
    // "ChangeStreamInsertDocument" object exposes the "txnNumber" property, which represents
    // the transaction identifier. If you need multi-document transactions in your application,
    // you can use this property to achieve atomicity.
    const insertedEvent = change.fullDocument;

    // todo: deserialize and publish to event bus
    const deserializedEvent = this.eventDeserializer.deserialize(insertedEvent);
    console.log(
      'EventBridge - Publishing event to EventBus:',
      deserializedEvent,
    );
    this.eventBus.subject$.next(deserializedEvent);
  }
}
