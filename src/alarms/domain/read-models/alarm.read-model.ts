// model for read-intensive operations, optimize for read performance
// such as queries and reporting and using
// and representing the data in a way that is easy to read and understand by end-users or other systems.
// reducing the time and resources required to retrieve and process the data.
// Other model is the write model, which is optimized for write operations
//
//
//
export class AlarmReadModel {
  id: string;
  name: string;
  severity: string;
  triggeredAt: Date;
  isAcknowledged: boolean;
  items: {
    name: string;
    type: string;
  }[];
}
