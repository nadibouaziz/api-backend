import { Module } from '@nestjs/common';
import { HashingService } from './hash.service';

@Module({
  imports: [],
  controllers: [],
  providers: [HashingService],
  exports: [HashingService],
})
export class HashingModule {}
