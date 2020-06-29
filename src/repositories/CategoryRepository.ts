import { EntityRepository, Repository, getManager } from 'typeorm';

import Category from '../models/Category';

interface Request {
  category: string;
}

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async createOrFindCategory({ category }: Request): Promise<Category> {
    const categoryAlreadyExists = await this.findOne({
      where: { title: category },
    });

    if (categoryAlreadyExists) {
      return categoryAlreadyExists;
    }

    const categoryEntity = await this.save({
      title: category,
    });

    return categoryEntity;
  }
}

export default CategoryRepository;
