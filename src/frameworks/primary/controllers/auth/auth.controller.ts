import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/core/domain/user/user.domain';
import { AuthUseCase } from 'src/core/ports/in/auth/auth-usecase.port';
import { UserUseCase } from 'src/core/ports/in/user/user-usecase.port';
import { Transactional } from 'typeorm-transactional';
import { Public } from '../../decorators/public.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterUserDto,
} from '../../dto/request/auth/auth.dto';
import { ResponseDto } from '../../dto/response/response.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly userUseCase: UserUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authUseCase.login(loginDto);

    return new ResponseDto('Login Successful', data);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @Public()
  @Transactional()
  async create(@Body() createUserDto: RegisterUserDto) {
    await this.authUseCase.register(createUserDto);
    return new ResponseDto('User Created');
  }

  @ApiBearerAuth()
  @Patch('change-password')
  @ApiOperation({ summary: 'Change User Password' })
  async changePassword(
    @Body()
    changePasswordDto: ChangePasswordDto,
    @AuthUser() user: User,
  ) {
    await this.authUseCase.changePasswordById(user.userId, changePasswordDto);

    return new ResponseDto('Password Changed Successfully');
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get User Profile' })
  async getProfile(@AuthUser() user: User) {
    return new ResponseDto(
      'Profile Fetched',
      await this.authUseCase.getProfileById(user.userId),
    );
  }
}
