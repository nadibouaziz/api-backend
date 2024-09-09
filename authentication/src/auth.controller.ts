import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterService } from './core/register/register.service';
import { LoginService } from './core/login/login.service';
import { RegisterDto } from './core/register/dto/register.dto';
import { LoginDto } from './core/login/dto/login.dto';
import { Public } from './common/decorators/public.decorators';
import { UserModel } from './core/repositories/models/user.model';

@Controller()
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ status: string; message: string; user: UserModel }> {
    const user = await this.registerService.register(registerDto);
    return {
      status: 'success',
      message:
        'Registration successful. A verification email has been sent to your email address.',
      user,
    };
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return await this.loginService.login(loginDto);
  }
}
