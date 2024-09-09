import {
  Injectable,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { HashingService } from '../../common/hash/hash.service';
import { UserRepository } from '../repositories/user.repository';
import { UserModel } from '../repositories/models/user.model';


@Injectable()
export class RegisterService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserModel> {
    const {
      email,
      username,
      password,
      confirmationPassword,
      ...additionalInformation
    } = registerDto;

    // Check if passwords match
    if (password !== confirmationPassword) {
      throw new UnprocessableEntityException('Passwords do not match');
    }

    // Check if the user already exists
    // TODO : check username !
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const salt = this.hashingService.generateSalt();
    const hashedPassword = this.hashingService.hash(password, salt);

    const newUser = await this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      salt,
      ...additionalInformation,
    });

    // TODO:
    // send email verification
    // send notification in kafka
    return new UserModel(newUser);
  }
}
