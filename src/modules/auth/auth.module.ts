import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUseCaseImpl } from 'src/core/application/usecases/auth/auth.usecase';
import { AuthUseCase } from 'src/core/ports/in/auth/auth-usecase.port';
import { AuthController } from 'src/frameworks/primary/controllers/auth/auth.controller';
import { JwtStrategy } from 'src/frameworks/primary/strategies/jwt.strategy';
import { RoleEntity } from 'src/frameworks/secondary/role/role.entity';
import { AllConfig } from 'src/infrastructure/config/config.type';
import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { RoleUseCase } from 'src/core/ports/in/role/role-usecase.port';
import { RoleUseCaseImpl } from 'src/core/application/usecases/role/role.usecase';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfig>) => ({
        secret: configService.get('auth.secret', { infer: true }),
        signOptions: {
          expiresIn: configService.get('auth.expires', { infer: true }),
        },
      }),
    }),
    UserModule,
    CartModule,
    TypeOrmModule.forFeature([RoleEntity]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthUseCase,
      useClass: AuthUseCaseImpl,
    },
    {
      provide: RoleUseCase,
      useClass: RoleUseCaseImpl,
    },
    JwtStrategy,
  ],
  exports: [AuthUseCase],
})
export class AuthModule {}
