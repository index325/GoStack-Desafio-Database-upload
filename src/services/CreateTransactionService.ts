import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';
import CategoryRepository from '../repositories/CategoryRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getCustomRepository(CategoryRepository);

    categoryRepository.createOrFindCategory({ category });
    transactionRepository.save({
      
    });
  }
}

export default CreateTransactionService;
