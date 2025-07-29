import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/core/domain/user/user.domain';
import { AuthUseCase } from 'src/core/ports/in/auth/auth-usecase.port';
import { UserRepository } from 'src/core/ports/out/user/user-repository.port';
import { USER_STATUS } from 'src/common/enums/user/user.enum';
import { CartEntity } from 'src/frameworks/secondary/cart/cart.entity';
import { CartRepository } from 'src/core/ports/out/cart/cart-repository.port';
import { RegisterUserDto } from 'src/frameworks/primary/dto/request/auth/auth.dto';
import { RoleRepository } from 'src/core/ports/out/role/role-repository.port';

@Injectable()
export class AuthUseCaseImpl implements AuthUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly cartRepository: CartRepository,
  ) {}

  async login({ email, password }: Pick<User, 'email' | 'password'>): Promise<{
    token: string;
    user: User;
  }> {
    const user = await this.userRepository.findUserWithPrivileges({
      email: email.toLowerCase(),
    });
    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }

    if (user.userStatus === USER_STATUS.ARCHIVED)
      throw new NotFoundException('User does not exist');

    const userPassword = await this.userRepository.findUserPassword({
      email: user.email,
    });

    const isMatched = await bcrypt.compare(password, userPassword);

    if (!isMatched) throw new BadRequestException('Invalid Credentials');

    // Check if User is Verified
    if (user.userStatus !== USER_STATUS.VERIFIED) {
      throw new BadRequestException('User is not verified');
    }

    const payload = { sub: user.userId };

    return {
      token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async register(data: RegisterUserDto): Promise<User> {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check for email
    const userEmailExists = await this.userRepository.findUser({
      email: data.email.toLowerCase(),
    });

    if (userEmailExists)
      throw new BadRequestException('User with email already exists');

    // Check for phone
    if (data.phone) {
      const userPhoneExists = await this.userRepository.findUser({
        phone: data.phone,
      });

      if (userPhoneExists)
        throw new BadRequestException('User with phone already exists');
    }

    const role = await this.roleRepository.findRole({ roleName: 'USER' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = await this.userRepository.createUser({
      userName: data.userName,
      image: data.image,
      role,
      phone: data.phone,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      userStatus: USER_STATUS.NOT_VERIFIED,
    });
    // Create a cart for the user
    const cart = new CartEntity();
    cart.user_id = user.userId;
    await this.cartRepository.saveCart(cart);
    return user;
  }

  async getProfileById(userId: User['userId']) {
    const userData = await this.userRepository.findUserWithPrivileges({
      userId,
    });

    if (!userData) throw new NotFoundException('User not found');
    return userData;
  }

  async changePasswordById(
    userId: User['userId'],
    {
      newPassword,
      oldPassword,
    }: {
      newPassword: string;
      oldPassword: string;
    },
  ): Promise<void> {
    const currentPassword = await this.userRepository.findUserPassword({
      userId,
    });

    const isMatched = await bcrypt.compare(oldPassword, currentPassword);

    if (!isMatched) throw new BadRequestException('Incorrect Password');

    const salt = await bcrypt.genSalt(10);

    const encryptedPassword = await bcrypt.hash(newPassword, salt);

    await this.userRepository.updateUser(
      { userId },
      {
        password: encryptedPassword,
      },
    );
  }
}
