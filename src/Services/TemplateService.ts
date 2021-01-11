import chalk from 'chalk';
import { template } from 'dot';

export const getTemplatedString = (data: any, file: string): string => {
  try {
    let templateVariable = template(file);
    return templateVariable(data);
  } catch (err) {
    console.error(chalk.red(chalk.bold('Error ')) + err.message);
    throw err;
  }
};
