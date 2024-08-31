import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Controller()
export class AppController {
  constructor(private readonly producerService: ProducerService) {}

  @Get('/login')
  async getHello(): Promise<string> {
    await this.producerService
      .produce({
        topic: 'my-topic',
        messages: [
          { key: 'userId', value: '1234' },
          { key: 'sessionId', value: '6548' },
        ],
      })
      .catch((e) => {
        console.log(e);
      });

    return 'Hello wrold';
  }
}
