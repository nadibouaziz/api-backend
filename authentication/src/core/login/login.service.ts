import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '../../common/hash/hash.service';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class LoginService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findByEmail(email);

    if (
      !user ||
      !this.hashingService.compare(password, user.salt, user.password)
    ) {
      throw new UnprocessableEntityException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };

    // TODO :  create Redis Session Id

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
