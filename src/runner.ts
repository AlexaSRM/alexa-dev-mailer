import chalk from 'chalk';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createSesMail, sendEmail } from './Services/AwsService';
import { DatabaseService } from './Services/DatabaseService';
import { getTemplatedString } from './Services/TemplateService';

const delay = delayInms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
};
export const runnerFunction = async (options: { list: string; html: string; text: string; subject: string }) => {
  try {
    console.log(chalk.blue(chalk.bold('Info ')) + 'Reading HTML File...');
    let htmlBuffer = await fs.readFile(join(__dirname, '..', options.html));
    console.log(chalk.blue(chalk.bold('Info ')) + 'Reading Text File...');
    let textBuffer = await fs.readFile(join(__dirname, '..', options.text));
    console.log(chalk.blue(chalk.bold('Info ')) + 'Fetching Mailing List...');
    let response = await DatabaseService.getMongoDatabase()
      .collection(process.env.COLLECTION_NAME)
      .findOne({ name: options.list });
    if (response === null) throw Error('There is some problem with fetching the mailing list');

    const responseLength = response.users.length;
    let success = 0,
      failed = 0;
    let failedEmails = [];
    console.log(chalk.blue(chalk.bold('Info ')) + `Started Sending ${responseLength} Emails...`);

    for (let i = 0; i < responseLength; i++) {
      let user = response.users[i];
      let mail = createSesMail(
        getTemplatedString(user, htmlBuffer.toString()),
        getTemplatedString(user, textBuffer.toString()),
        options.subject,
        user.email,
      );
      await delay(500);
      try {
        await sendEmail(mail);
        console.log(chalk.green(chalk.bold(`Success [${(success += 1)}] `)) + 'Email sent to ' + user.email);
      } catch (err) {
        failedEmails.push(user.email);
        console.error(chalk.red(chalk.bold(`Error [${(failed += 1)}]`)) + user + err.message);
      }
    }
    console.log(chalk.blue(chalk.bold('Info ')) + 'Mailing process finished');
    console.log(
      chalk.blue(chalk.bold('Total ')) +
        responseLength +
        chalk.green(chalk.bold(' Success ')) +
        success +
        chalk.red(chalk.bold(' Failed ')) +
        failed,
    );
    if (failedEmails.length > 0) {
      console.log(chalk.red(chalk.bold('Failed Emails: ')) + failedEmails.join(', '));
    }
    process.exit();
  } catch (err) {
    console.error(chalk.red(chalk.bold('Error ')) + err.message);
    throw err;
  }
};
