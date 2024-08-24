import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY,
});

const sentFrom = new Sender("alexaverse@alexadevsrm.org", "Alexa Developers SRM");

export const createEmail = (email: any, name: any, html: string, text: string, subject: string) => {
    return new EmailParams()
        .setFrom(sentFrom)
        .setTo([
        new Recipient(email, name)
        ])
        .setSubject(subject)
        .setHtml(html)
        .setText(text);
}

export const sendBulkEmail = async (emails: EmailParams[]) => {
    const res = await mailerSend.email.sendBulk(emails);
    console.log(res);
}
// const bulkEmails = [];

// const emailParams = new EmailParams()
//   .setFrom(sentFrom)
//   .setTo([
//     new Recipient("your@client.com", "Your Client")
//   ])
//   .setSubject("This is a Subject")
//   .setHtml("<strong>This is the HTML content</strong>")
//   .setText("This is the text content");

// bulkEmails.push(emailParams);

// const emailParams2 = new EmailParams()
//   .setFrom(sentFrom)
//   .setTo([
//     new Recipient("your_2@client.com", "Your Client 2")
//   ])
//   .setSubject("This is a Subject 2")
//   .setHtml("<strong>This is the HTML content 2</strong>")
//   .setText("This is the text content 2");

// bulkEmails.push(emailParams2);

// await mailerSend.email.sendBulk(bulkEmails);