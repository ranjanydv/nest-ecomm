import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { TypeOrmConfigService } from './infrastructure/database/typeorm.service';
import { UserModule } from './modules/user/user.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './frameworks/primary/guards/jwt-auth.guard';
import { PrivilegeGuard } from './frameworks/primary/guards/privilege.guard';
import { appConfig } from './infrastructure/config/app.config';
import { databaseConfig } from './infrastructure/config/database.config';
import { authConfig } from './infrastructure/config/auth.config';
import { LoggingInterceptor } from './frameworks/primary/interceptors/logging.interceptor';
import { UploadModule } from './modules/upload/upload.module';
import { AddressModule } from './modules/address/address.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/review/review.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      envFilePath: ['.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', ''), // <-- path to the static files
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return addTransactionalDataSource(
          await new DataSource(options).initialize(),
        );
      },
    }),
    AuthModule,
    UserModule,
    VendorModule,
    AddressModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    ReviewModule,
    CartModule,
    WishlistModule,
    UploadModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PrivilegeGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
