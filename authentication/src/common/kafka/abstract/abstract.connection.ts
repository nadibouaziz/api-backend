import { Kafka } from 'kafkajs';
import * as fs from 'fs';

export abstract class AbstractKafkaConnnection {
  protected readonly _kafkaConnection = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: ['kafka:9093'],
    ssl: {
      ca: [fs.readFileSync(process.env.KAFKA_PATH_SIGNED_CERT!, 'utf8')],
      key: fs.readFileSync(process.env.KAFKA_PATH_CA_KEY_FILE!, 'utf8'),
      cert: fs.readFileSync(process.env.KAFKA_PATH_CA_CERT_FILE!, 'utf8'),
      passphrase: process.env.KAFKA_SSL_PASSWORD,
    },
  });
}
