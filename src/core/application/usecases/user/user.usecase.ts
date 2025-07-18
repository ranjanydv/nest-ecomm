import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { USER_STATUS } from 'src/common/enums/user/user.enum';
import { PaginationProps } from 'src/common/types/pagination.types';
import { User } from 'src/core/domain/user/user.domain';
import { RoleUseCase } from 'src/core/ports/in/role/role-usecase.port';
import { UserUseCase } from 'src/core/ports/in/user/user-usecase.port';
import { UserRepository } from 'src/core/ports/out/user/user-repository.port';

@Injectable()
export class UserUseCaseImpl implements UserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleUseCase: RoleUseCase,
  ) {}

  async getAllUsers(
    options: Partial<User>,
    filter: PaginationProps,
  ): Promise<[User[], number]> {
    return await this.userRepository.findAllUsers([options], filter);
  }

  async getUserById(userId: User['userId']): Promise<User> {
    await this.checkUserExistsOrFail([{ userId }]);

    return await this.userRepository.findUser({ userId });
  }

  async getUserByEmail(email: User['email']): Promise<User> {
    await this.checkUserExistsOrFail([{ email }]);

    return await this.userRepository.findUser({ email });
  }

  async createUser(data: User): Promise<User> {
    await this.roleUseCase.checkRoleExistsOrFail([data.role]);

    const salt = await bcrypt.genSalt(10);

    const password = await bcrypt.hash(data.password, salt);

    return await this.userRepository.createUser({
      ...data,
      email: data.email.toLowerCase(),
      password,
    });
  }

  async createBulkUser(data: User[]): Promise<User[]> {
    await this.roleUseCase.checkRoleExistsOrFail(data?.map(({ role }) => role));

    const users = await Promise.all(
      data.map(async (user) => {
        const salt = await bcrypt.genSalt(10);

        const password = await bcrypt.hash(user.password, salt);

        return {
          ...user,
          password,
        };
      }),
    );

    return await this.userRepository.createBulkUser(users);
  }

  async updateUserById(
    userId: User['userId'],
    data: Partial<User>,
  ): Promise<void> {
    await this.checkUserExistsOrFail([{ userId }]);

    if (data.role) await this.roleUseCase.checkRoleExistsOrFail([data.role]);

    const salt = await bcrypt.genSalt(10);

    const password = data?.password
      ? await bcrypt.hash(data.password, salt)
      : undefined;

    return await this.userRepository.updateUser(
      { userId },
      { ...data, password },
    );
  }

  async updateUserStatusById(userId: User['userId']): Promise<void> {
    await this.checkUserExistsOrFail([{ userId }]);

    const userData = await this.userRepository.findUser({ userId });

    const newStatus =
      userData.userStatus === USER_STATUS.ARCHIVED
        ? USER_STATUS.NOT_VERIFIED
        : USER_STATUS.ARCHIVED;

    return await this.userRepository.updateUser(
      { userId },
      { userStatus: newStatus },
    );
  }

  async checkUserExistsOrFail(options: Partial<User>[]): Promise<boolean> {
    if (await this.userRepository.userExists(options)) return true;

    throw new BadRequestException('User does not exist');
  }

  async countUsers(options?: Partial<User>): Promise<number> {
    return await this.userRepository.countUsers(options);
  }
}
