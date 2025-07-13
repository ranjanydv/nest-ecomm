import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryUseCaseImpl } from 'src/core/application/usecases/category/category.usecase';
import { CategoryUseCase } from 'src/core/ports/in/category/category-usecase.port';
import { CategoryRepository } from 'src/core/ports/out/category/category-repository.port';
import { CategoryController } from 'src/frameworks/primary/controllers/category/category.controller';
import { CategoryEntity } from '../../frameworks/secondary/category/category.entity';
import { CategoryRepositoryImpl } from '../../frameworks/secondary/category/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [
    {
      provide: CategoryUseCase,
      useClass: CategoryUseCaseImpl,
    },
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
  ],
  exports: [CategoryUseCase],
})
export class CategoryModule {}
