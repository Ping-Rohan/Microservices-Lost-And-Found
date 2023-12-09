import amqp, { Channel, Connection } from 'amqplib';

interface IpublishMessage {
  ROUTING_KEY: string;
  message: any;
  EXCHANGE_NAME: string;
}

interface IconsumeMessage {
  ROUTING_KEY: string;
  EXCHANGE_NAME: string;
}

class Broker {
  private connection: Connection | null = null;
  static channel: Channel | null = null;

  constructor(private BROKER_URL: string) {}

  async connect() {
    try {
      this.connection = await amqp.connect(this.BROKER_URL);
      Broker.channel = await this.connection.createChannel();
    } catch (err) {
      console.error('Error connecting to the broker:', err);
      throw err;
    }
  }

  async CreateExchange(Exchange: string) {
    try {
      await Broker.channel?.assertExchange(Exchange, 'direct', {
        durable: true,
      });
    } catch (err) {
      throw err;
    }
  }

  PublishMessage(opt: IpublishMessage) {
    try {
      const { ROUTING_KEY, message, EXCHANGE_NAME } = opt;
      Broker.channel?.publish(
        EXCHANGE_NAME,
        ROUTING_KEY,
        Buffer.from(JSON.stringify(message))
      );
      console.log('Message published');
    } catch (err) {
      throw err;
    }
  }

  async ConsumeMessage(opts: IconsumeMessage) {
    try {
      const { ROUTING_KEY, EXCHANGE_NAME } = opts;
      const queue = await Broker.channel?.assertQueue('', { exclusive: true });

      if (!queue) {
        throw new Error('Failed to create an exclusive queue.');
      }

      Broker.channel?.bindQueue(queue.queue, EXCHANGE_NAME, ROUTING_KEY);
      Broker.channel?.consume(queue.queue, (message) => {
        if (message) {
          console.log('Message got');
          console.log(message.content.toString());
          Broker.channel?.ack(message);
        }
      });
    } catch (err) {
      throw err;
    }
  }

  async close() {
    try {
      await this.connection?.close();
    } catch (err) {
      throw err;
    }
  }
}

export { Broker };
