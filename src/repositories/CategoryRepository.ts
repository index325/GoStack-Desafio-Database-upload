import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string;
}

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async createOrFindCategory({ title }: Request): Promise<Category> {
    const categoryAlreadyExists = await this.findOne({
      where: { title },
    });

    if (categoryAlreadyExists) {
      return categoryAlreadyExists;
    }

    const category = await this.save({
      title,
    });

    return category;
  }
}

export default CategoryRepository;
