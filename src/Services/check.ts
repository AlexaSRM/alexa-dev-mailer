import 'dotenv/config';
import { MailerSend } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY!,
});

mailerSend.email.getBulkStatus('66cbb6b9f220bf0e1ffc3f79') // bulk email Id e.g 63af1fdb790d97105a090001
  .then((response) => {
    console.log(response.body);
    console.log(response.body.data.validation_errors);
  });