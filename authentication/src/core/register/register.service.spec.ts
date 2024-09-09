import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import {
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { HashingService } from '../../common/hash/hash.service';

describe('RegisterService', () => {
  let registerService: RegisterService;
  let hashingService: HashingService;
  let userRepository: UserRepository;
  let registerDto: RegisterDto;

  const todayDate = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: HashingService,
          useValue: {
            generateSalt: jest.fn(),
            hash: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    registerService = module.get<RegisterService>(RegisterService);
    hashingService = module.get<HashingService>(HashingService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('register', () => {
    beforeEach(() => {
      registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmationPassword: 'password123',
        firstname: 'Test',
        lastname: 'User',
        profilePicture: '',
        birthday: todayDate,
      };
    });

    it('should register a new user with valid data', async () => {
      const salt = 'salt';
      const hashedPassword = 'hashedpassword';
      const createdUser = new UserModel({
        id: '1',
        ...registerDto,
        password: hashedPassword,
        salt,
      });

      jest.spyOn(hashingService, 'generateSalt').mockReturnValue(salt);
      jest.spyOn(hashingService, 'hash').mockReturnValue(hashedPassword);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockResolvedValue(createdUser);

      const result = await registerService.register(registerDto);

      expect(result).toEqual(createdUser);
      expect(hashingService.generateSalt).toHaveBeenCalled();
      expect(hashingService.hash).toHaveBeenCalledWith(
        registerDto.password,
        salt,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );

      expect(userRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        salt,
        firstname: registerDto.firstname,
        lastname: registerDto.lastname,
        profilePicture: registerDto.profilePicture,
        birthday: registerDto.birthday,
      });
    });

    it('should throw UnprocessableEntityException for password mismatch', async () => {
      registerDto.confirmationPassword = 'wrongpassword';

      await expect(registerService.register(registerDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should throw ConflictException for existing email', async () => {
      const existingUser = new UserModel({
        id: '1',
        email: registerDto.email,
        username: registerDto.username,
        firstname: '',
        lastname: '',
        birthday: todayDate,
        profilePicture: '',
        password: '',
        salt: '',
      });

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(existingUser);

      await expect(registerService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );
    });
  });
});
