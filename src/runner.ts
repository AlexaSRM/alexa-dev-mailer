import chalk from 'chalk';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createSesMail, sendEmail } from './Services/AwsService';
import { DatabaseService } from './Services/DatabaseService';
import { getTemplatedString } from './Services/TemplateService';
import { createEmail, sendBulkEmail } from './Services/SenderMail';

const delay = delayInms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
};

// Helper function to convert a string to title case
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
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

    const bulkEmails = [];
    for (let i = 0; i < responseLength; i++) {
      let user = response.users[i];
      try {
        // Trim spaces, convert email to lowercase and name to title case
        const email = user.mail.trim().toLowerCase();
        // const name = `${user.firstName.trim()} ${user.lastName.trim()}`;
        // const email = user.srmEmailId.trim().toLowerCase();
        const name = user.name.trim();
        const titleCaseName = toTitleCase(name).trim();
        user.name = toTitleCase(user.name.trim())
        // user.rsvpLink = "https://flask-production-acb6.up.railway.app/api/puzzle/rsvp/"+user.registrationNumber;
        console.log(`Processing user: ${titleCaseName} <${email}>`);

        bulkEmails.push(
          createEmail(
            email,
            titleCaseName,
            getTemplatedString(user, htmlBuffer.toString()),
            getTemplatedString(user, textBuffer.toString()),
            options.subject,
          ),
        );

        // Uncomment to simulate sending individual emails:
        // let mail = createSesMail(
        //   getTemplatedString(user, htmlBuffer.toString()),
        //   getTemplatedString(user, textBuffer.toString()),
        //   options.subject,
        //   email,
        // );
        // await delay(500);
        // await sendEmail(mail);
        
        success += 1;
        console.log(chalk.green(chalk.bold(`Success [${success}] `)) + 'Email created for ' + email);
      } catch (err) {
        failed += 1;
        failedEmails.push(user.srmMailId);
        console.error(chalk.red(chalk.bold(`Error [${failed}]`)) + 'Email failed for ' + user.srmMailId + ': ' + err.message);
      }
    }

    const id = await sendBulkEmail(bulkEmails);
    console.log(chalk.blue(chalk.bold('Info ')) + 'Bulk Email ID: ' + id);
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
    console.error(chalk.red(chalk.bold('Error ')), err);
    throw err;
  }
};
