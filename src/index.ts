import chalk from 'chalk';
import { DatabaseService } from './Services/DatabaseService';

require('dotenv').config();

const app = async () => {
  await DatabaseService.getInstance().testDatabaseConnection();
  console.log(chalk.green(chalk.bold('Success ')) + 'Connected to Database');
};

app();
