import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivilegeUseCaseImpl } from 'src/core/application/usecases/privilege/privilege.usecase';
import { RoleUseCaseImpl } from 'src/core/application/usecases/role/role.usecase';
import { UserUseCaseImpl } from 'src/core/application/usecases/user/user.usecase';
import { PrivilegeUseCase } from 'src/core/ports/in/privilege/privilege-usecase.port';
import { RoleUseCase } from 'src/core/ports/in/role/role-usecase.port';
import { UserUseCase } from 'src/core/ports/in/user/user-usecase.port';
import { PrivilegeRepository } from 'src/core/ports/out/privilege/privilege-repository.port';
import { RoleRepository } from 'src/core/ports/out/role/role-repository.port';
import { UserRepository } from 'src/core/ports/out/user/user-repository.port';
import { PrivilegeController } from 'src/frameworks/primary/controllers/privilege/privilege.controller';
import { RoleController } from 'src/frameworks/primary/controllers/role/role.controller';
import { UserController } from 'src/frameworks/primary/controllers/user/user.controller';
import { CartEntity } from 'src/frameworks/secondary/cart/cart.entity';
import { PrivilegeEntity } from '../../frameworks/secondary/privilege/privilege.entity';
import { PrivilegeRepositoryImpl } from '../../frameworks/secondary/privilege/privilege.repository';
import { RoleEntity } from '../../frameworks/secondary/role/role.entity';
import { RoleRepositoryImpl } from '../../frameworks/secondary/role/role.repository';
import { UserEntity } from '../../frameworks/secondary/user/user.entity';
import { UserRepositoryImpl } from '../../frameworks/secondary/user/user.repository';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      PrivilegeEntity,
      CartEntity,
    ]),
    CartModule,
  ],
  controllers: [UserController, RoleController, PrivilegeController],
  providers: [
    {
      provide: UserUseCase,
      useClass: UserUseCaseImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: RoleUseCase,
      useClass: RoleUseCaseImpl,
    },
    {
      provide: RoleRepository,
      useClass: RoleRepositoryImpl,
    },
    {
      provide: PrivilegeUseCase,
      useClass: PrivilegeUseCaseImpl,
    },
    {
      provide: PrivilegeRepository,
      useClass: PrivilegeRepositoryImpl,
    },
  ],
  exports: [
    UserUseCase,
    RoleUseCase,
    PrivilegeUseCase,
    UserRepository,
    RoleRepository,
  ],
})
export class UserModule {}
