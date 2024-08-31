import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'redis',
      port: 6379,
      tls: {
        rejectUnauthorized: true,
        requestCert: true,
        ca: fs.readFileSync('/etc/redis/certs/ca.crt'),
        cert: fs.readFileSync('/etc/redis/certs/redis-server.crt'),
        key: fs.readFileSync('/etc/redis/certs/redis-server.key'),
      }
    },
  });

  await app.startAllMicroservices().catch(e => console.log(e))
  await app.listen(3000); 
}
bootstrap();
