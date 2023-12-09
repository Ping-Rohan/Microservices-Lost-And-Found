import { Broker } from './Broker';

const broker = new Broker('amqp://rabbitmq-srv:5672');

export { broker };
