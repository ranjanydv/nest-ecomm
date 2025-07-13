import { CATEGORY_STATUS } from 'src/common/enums/category/category.enum';

export type CreateCategoryProps = {
  name: string;
  slug?: string;
  description?: string;
  parentCategoryId?: string;
  iconUrl?: string;
  status?: CATEGORY_STATUS;
};

export type UpdateCategoryProps = Partial<CreateCategoryProps>;
