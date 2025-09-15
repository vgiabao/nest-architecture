import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import { Model } from 'mongoose';
import { SerializableEvent } from 'src/shared/domain/interfaces/serializable-event';
import { EventDeserializer } from './deserializers/event.deserializer';
import { EventStore } from 'src/shared/application/ports/event-store';
import { EVENT_STORE_CONNECTION } from 'src/core/core.constant';

@Injectable()
export class MongoEventStore implements EventStore {
  private readonly logger = new Logger(MongoEventStore.name);
  constructor(
    @InjectModel(Event.name, EVENT_STORE_CONNECTION)
    private readonly eventStore: Model<Event>,
    private readonly eventDeserializer: EventDeserializer,
  ) {}

  async persist(eventOrEvents: SerializableEvent | SerializableEvent[]) {
    const events = Array.isArray(eventOrEvents)
      ? eventOrEvents
      : [eventOrEvents];

    const session = await this.eventStore.startSession();
    try {
      session.startTransaction();
      await this.eventStore.insertMany(events, { session, ordered: true });
      await session.commitTransaction();
      this.logger.log(`Persisted ${events.length} event(s) to the event store`);
    } catch (error) {
      await session.abortTransaction();

      const UNIQUE_CONSTRAINT_VIOLATION = 11000;
      if (error.code === UNIQUE_CONSTRAINT_VIOLATION) {
        this.logger.error(
          `Event store: Duplicate event detected. This might happen if an event is published more than once. Error: ${error.message}`,
        );
        console.error(error.writeErrors?.[0]?.errmsg);
      } else {
        throw error;
      }
    } finally {
      session.endSession();
    }
  }

  async getEventsByStreamId(streamId: string): Promise<SerializableEvent[]> {
    const events = await this.eventStore
      .find({ streamId })
      .sort({ position: 1 });
    if (!events.length) {
      throw new Error(`No events found for streamId: ${streamId}`);
    }
    return events.map((event) =>
      this.eventDeserializer.deserialize(event.toJSON()),
    );
  }
}
