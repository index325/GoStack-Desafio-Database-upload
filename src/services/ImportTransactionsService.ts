import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import { getCustomRepository } from 'typeorm';
import CategoryRepository from '../repositories/CategoryRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  file: string;
}

class ImportTransactionsService {
  async execute({ file }: Request): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const readCSVStream = fs.createReadStream(
      path.join(uploadConfig.directory, file),
    );

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: any = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    lines.forEach((line: any) => {
      const lineObj = Object.assign({}, line);
      let transaction: any = {};
      transaction.title = lineObj[0];
      transaction.type = lineObj[1];
      transaction.value = lineObj[2];
      transaction.category = lineObj[3];

      transactions.push(transaction);
    });

    transactions.forEach(async (transaction: Transaction) => {

      await categoryRepository.createOrFindCategory({
        category: transaction.category,
      })

      // return await transactionRepository.save({
      //   title: transaction.title,
      //   value: transaction.value,
      //   type: transaction.type,
      //   category_id: categoryEntity.id,
      // });
    });

    return transactions;
  }
}

export default ImportTransactionsService;
