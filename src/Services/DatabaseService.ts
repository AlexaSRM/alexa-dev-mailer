import { MongoClient, Db } from 'mongodb';
import chalk from 'chalk';

export class DatabaseService {
  private static instance: DatabaseService;
  private client: MongoClient = new MongoClient(process.env.MONGODB_URI!, {
    useUnifiedTopology: true,
  });

  private constructor() {}

  testDatabaseConnection = async () => {
    this.client.connect(err => {
      if (err) {
        console.error(chalk.red(chalk.bold('Error')) + err.message);
        throw err;
      }
    });
  };

  static getInstance = (): DatabaseService => {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  };

  static getMongoDatabase = (): Db => {
    return DatabaseService.instance.client.db();
  };
}
