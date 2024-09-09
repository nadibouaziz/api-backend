import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { KafkaModule } from './common/kafka/kafka.module';
import { LoginService } from './core/login/login.service';
import { RegisterService } from './core/register/register.service';
import { HashingModule } from './common/hash/hash.module';
import { UserRepository } from './core/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [KafkaModule, HashingModule, JwtModule, DatabaseModule],
  controllers: [AuthController],
  providers: [LoginService, RegisterService, UserRepository],
})
export class AuthModule {}
