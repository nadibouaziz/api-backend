import { OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { AbstractKafkaConnnection } from '../abstract/abstract.connection';
import { Consumer, ConsumerSubscribeTopics, EachMessagePayload } from 'kafkajs';

interface KafkajsConsumerOptions {
  topic: ConsumerSubscribeTopics;
  groupId: string;
  onMessage: (message: EachMessagePayload) => Promise<void>;
}

export class ConsumerService
  extends AbstractKafkaConnnection
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly consumers: Consumer[] = [];

  async onModuleInit() {}

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async consume({ topic, groupId, onMessage }: KafkajsConsumerOptions) {
    // We need to specifiy the groupId while initializing the Kafka Consumer
    const consumer = this._kafkaConnection.consumer({
      groupId: groupId,
    });

    // Connecting Consumer
    await consumer.connect();

    // Passing Topics to consumer
    await consumer.subscribe(topic);

    // Function to execute for each Messages
    await consumer.run({
      eachMessage: onMessage,
    });

    // Gathering all the Consumers
    this.consumers.push(consumer);
  }
}
