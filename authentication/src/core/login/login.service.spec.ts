import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repository';
import { UnprocessableEntityException } from '@nestjs/common';
import { HashingService } from '../../common/hash/hash.service';
import { UserModel } from '../repositories/models/user.model';

describe('LoginService', () => {
  let loginService: LoginService;
  let hashingService: HashingService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const user = new UserModel({
    id: '1',
    username: 'testuser',
    password: 'hashedpassword',
    salt: 'salt',
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    birthday: new Date(),
    profilePicture: 'string',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: HashingService,
          useValue: {
            compare: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    hashingService = module.get<HashingService>(HashingService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const accessToken = 'access_token';

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(hashingService, 'compare').mockReturnValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(accessToken);

      const result = await loginService.login(loginDto);
      expect(result).toEqual({ access_token: accessToken });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(hashingService.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.salt,
        user.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
      });
    });

    it('should throw UnprocessableEntityException for invalid email', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(loginService.login(loginDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnprocessableEntityException for invalid password', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(hashingService, 'compare').mockReturnValue(false);

      await expect(loginService.login(loginDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(hashingService.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.salt,
        user.password,
      );
    });
  });
});