import { OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { AbstractKafkaConnnection } from '../abstract/abstract.connection';
import { Producer, ProducerRecord } from 'kafkajs';

export class ProducerService
  extends AbstractKafkaConnnection
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly producer: Producer = this._kafkaConnection.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }
}
