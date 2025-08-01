/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { PaginationProps } from 'src/common/types/pagination.types';
import { User } from 'src/core/domain/user/user.domain';
import { CreateUserProps } from 'src/core/domain/user/user.types';

export abstract class UserUseCase {
  abstract getAllUsers(
    options: Partial<User>,
    filter: PaginationProps,
  ): Promise<[User[], number]>;

  abstract getUserById(id: User['userId']): Promise<User>;

  abstract getUserByEmail(email: User['email']): Promise<User>;

  abstract createUser(data: CreateUserProps): Promise<User>;

  abstract createBulkUser(data: User[]): Promise<User[]>;

  abstract updateUserById(
    id: User['userId'],
    data: Partial<User>,
  ): Promise<void>;

  abstract updateUserStatusById(id: User['userId']): Promise<void>;

  abstract checkUserExistsOrFail(
    options: Partial<User>[],
  ): Promise<boolean | never>;

  abstract countUsers(options?: Partial<User>): Promise<number>;
}
