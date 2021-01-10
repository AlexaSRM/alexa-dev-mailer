import { Credentials, SESV2 } from 'aws-sdk';
import { SendEmailRequest } from 'aws-sdk/clients/sesv2';
require('dotenv').config();

const ses = new SESV2({
  apiVersion: '2019-09-27',
  region: 'ap-south-1',
  credentials: new Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }),
});

export const sendEmail = (mail: SendEmailRequest) => {
  let request = ses.sendEmail(mail);
  return request.promise();
};

export const createSesMail = (
  html: string,
  text: string,
  subject: string,
  receiverEmail: string,
  fromEmail: string,
): SendEmailRequest => {
  const mail: SendEmailRequest = {
    Content: {
      Simple: {
        Body: {
          Html: {
            Data: html,
          },
          Text: {
            Data: text,
          },
        },
        Subject: {
          Data: subject,
        },
      },
    },
    Destination: {
      ToAddresses: [receiverEmail],
    },
    ReplyToAddresses: ['contact@alexadevsrm.com'],
    FromEmailAddress: fromEmail,
  };
  return mail;
};
