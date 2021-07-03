import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config } from '../config';
import * as nodemailer from 'nodemailer';

export interface MailAttachment {
  filename: string;
  content: Buffer;
}

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const SES = new AWS.SES({
      region: config.aws.region,
    });
    this.transporter = nodemailer.createTransport({
      SES,
    });
  }

  public async sendEmail(
    receiver: string,
    subject: string,
    html: string,
    attachments?: MailAttachment[],
  ) {
    const mailOptions = {
      from: config.aws.ses.address,
      subject,
      html,
      to: receiver,
      attachments,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (err: Error | null, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
