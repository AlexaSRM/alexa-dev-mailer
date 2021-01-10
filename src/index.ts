import chalk from 'chalk';
import inquirer from 'inquirer';
import { DatabaseService } from './Services/DatabaseService';

require('dotenv').config();

const questions: inquirer.QuestionCollection<any> = [
  {
    type: 'input',
    name: 'list',
    message: 'What is the mailing list you want to use?',
  },
  {
    type: 'input',
    name: 'html',
    message: 'What is the HTML file you want to use?',
  },
  {
    type: 'input',
    name: 'text',
    message: 'What is the Text file you want to use?',
  },
  {
    type: 'input',
    name: 'subject',
    message: 'What will be the subject?',
  },
  {
    type: 'input',
    name: 'email',
    message: 'What alias you want to use?',
  },
];

const app = async () => {
  await DatabaseService.getInstance().testDatabaseConnection();
  console.log(chalk.green(chalk.bold('Success ')) + 'Connected to Database');
  inquirer.prompt(questions).then((answers: inquirer.Answers) => {
    console.log(answers);
  });
};

app();
