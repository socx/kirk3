
import { createTransport } from 'nodemailer';
import {
  NEW_EXPENSE_NOTIFICATION_TEMPLATE,
  PASSWORD_RESET_COMPLETION_TEMPLATE,
  PASSWORD_RESET_INITIATION_TEMPLATE,
  SIGN_UP_CONFIRMATION_TEMPLATE,
  SIGN_UP_NOTIFICATION_TEMPLATE,
  SUPPORTING_DOCUMENT_NOTIFICATION_TEMPLATE,
  UPDATED_EXPENSE_NOTIFICATION_TEMPLATE,
} from '../lib/emailTemplates';
import { User } from '../interfaces/UserInterfaces';


export enum EmailTemplateTypes {
  SupportingDocNotification,
  UserRegistrationNotification,
  UserRegistrationConfirmation,
  UserPasswordResetCompletion,
  UserPasswordResetInitiation,
  ExpenseCreated,
  ExpenseUpdated,
}

export type Attachment = {
  filename: string,
  path: string
}

export type EmailDetails = {
  user: User,
  templateType: EmailTemplateTypes,
  token?: string,
  attachments?: Attachment[],
  extraInfo?: string
}

const adminNotifications = [
  EmailTemplateTypes.ExpenseCreated,
  EmailTemplateTypes.ExpenseUpdated,
  EmailTemplateTypes.SupportingDocNotification,
];

export const sendEmail = (emailDetails: EmailDetails) => {
  const { user, templateType, token, attachments } = emailDetails;
  const email = buildFromTemplate(emailDetails);
  const from = process.env.SMTP_USER
  const to = adminNotifications.includes(emailDetails.templateType) ?
    process.env.ADMIN_EMAIL as string : user.email;
  let mailOptions = attachments && attachments.length ? 
    {
      from,
      to,
      subject: email?.subject,
      html: email?.template,
      attachments,
    } :
    {
      from,
      to,
      subject: email?.subject,
      html: email?.template,
    };

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT as string);
  const smtp_user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  const transporter = createTransport({
    host,
    port,
    secure: true,
    auth: {
      user: smtp_user,
      pass
    }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error as Error);
    } else {
      console.log(`${templateType.toString()} Email sent: ${info.response}`);
    }
  });
}

const populateTemplate = (template: string, emailDetails: EmailDetails) => {
  const { user, token, } = emailDetails;
  const signUpUrl = `${process.env.APP_BASE_URL}/complete-sign-up?token=${user.userId}&email=${user.email}`;
  const loginUrl = `${process.env.APP_BASE_URL}/signin`;
  const changePasswordUrl = `${process.env.APP_BASE_URL}/change-password?token=${token}`;
  const privacyPolicyUrl = `${process.env.APP_BASE_URL}/privacy-policy`;
  const expensesUrl = `${process.env.APP_BASE_URL}/finance/expenses`;
  const bankTransactionsUrl = `${process.env.APP_BASE_URL}/finance/bank-transactions`;
    
  return template
    .replace(/\[\[APP_NAME\]\]/gi, process.env.APP_NAME as string)
    .replace(/\[\[NAME\]\]/gi, user.fullname)
    .replace(/\[\[LOGIN_URL\]\]/gi, loginUrl)
    .replace(/\[\[SIGN_UP_URL\]\]/gi, signUpUrl)
    .replace(/\[\[CHANGE_PASSWORD_URL\]\]/gi, changePasswordUrl)
    .replace(/\[\[PRIVACY_POLICY_URL\]\]/gi, privacyPolicyUrl)
    .replace(/\[\[EXPENSES_URL\]\]/gi, expensesUrl)
    .replace(/\[\[BANK_TRANSACTIONS_URL\]\]/gi, bankTransactionsUrl)
}

const buildFromTemplate = (emailDetails: EmailDetails) => {
  const { templateType} = emailDetails;
  switch(templateType) {
    case EmailTemplateTypes.UserRegistrationNotification:
      return {
        subject: `Account Activation`,
        template: populateTemplate(SIGN_UP_NOTIFICATION_TEMPLATE, emailDetails),
      };
    case EmailTemplateTypes.UserRegistrationConfirmation:
      return {
        subject: `Account Activation Confirmation`,
        template: populateTemplate(SIGN_UP_CONFIRMATION_TEMPLATE, emailDetails),
      };
    case EmailTemplateTypes.UserPasswordResetInitiation:
      return {
        subject: `Password Reset`,
        template: populateTemplate(PASSWORD_RESET_INITIATION_TEMPLATE, emailDetails),
      };
    case EmailTemplateTypes.UserPasswordResetCompletion:
      return {
        subject: `Password Reset Confirmation.`,
        template: populateTemplate(PASSWORD_RESET_COMPLETION_TEMPLATE, emailDetails),
      };
    case EmailTemplateTypes.ExpenseCreated:
      return {
        subject: 'A new expense has been created',
        template: populateTemplate(NEW_EXPENSE_NOTIFICATION_TEMPLATE, emailDetails),
      };
    case EmailTemplateTypes.ExpenseUpdated:
      return {
        subject: 'An expense has been updated',
        template: populateTemplate(UPDATED_EXPENSE_NOTIFICATION_TEMPLATE, emailDetails),
      };
    case EmailTemplateTypes.SupportingDocNotification:
      let template = populateTemplate(SUPPORTING_DOCUMENT_NOTIFICATION_TEMPLATE, emailDetails);
      template = template.replace(/\[\[TRANSACTION_DETAILS\]\]/gi, emailDetails.extraInfo as string);
      return {
        subject: 'Bank Transaction Supporting Document(s) Uploaded',
        template
      };
  }
}
