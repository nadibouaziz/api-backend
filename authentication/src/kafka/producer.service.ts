import { OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import * as fs from 'fs';

export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    clientId: 'my-app',
    brokers: [process.env.KAFKA_BROKER!],
    authenticationTimeout: 2000,
    reauthenticationThreshold: 2000,
    ssl: {
      rejectUnauthorized: false,
      ca: [fs.readFileSync('/etc/kafka/secrets/ca.pem', 'utf-8')],
      key: fs.readFileSync('/etc/kafka/secrets/client-key.pem', 'utf-8'),
      cert: fs.readFileSync('/etc/kafka/secrets/client-cert.pem', 'utf-8'),
      passphrase: 'password',
    },
  });

  private readonly producer: Producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect().catch((e) => console.log('KAFKA_ERROR :', e));
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
