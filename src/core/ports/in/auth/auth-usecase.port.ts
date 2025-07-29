import { User } from 'src/core/domain/user/user.domain';
import { RegisterUserDto } from 'src/frameworks/primary/dto/request/auth/auth.dto';

export abstract class AuthUseCase {
  abstract login(
    data: Pick<User, 'email' | 'password'>,
  ): Promise<{ token: string }>;

  abstract register(data: RegisterUserDto): Promise<User>;

  abstract getProfileById(userId: User['userId']): Promise<User>;

  abstract changePasswordById(
    userId: User['userId'],
    data: { newPassword: string; oldPassword: string },
  ): Promise<void>;
}
