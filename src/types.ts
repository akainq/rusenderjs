export interface MailContact {
  email: string;
  name?: string;
}

export interface MailAttachmentItem {
  [filename: string]: string; // filename: base64 content
}

export type MailAttachments = MailAttachmentItem[];

export interface MailHeaders {
  [key: string]: string;
}

export interface BaseMailOptions {
  to: MailContact;
  from: MailContact;
  subject: string;
  previewTitle?: string;
  headers?: MailHeaders;
  cc?: string;
  bcc?: string;
  attachments?: MailAttachments;
}

export interface SendMailOptions extends BaseMailOptions {
  html?: string;
  text?: string;
}

export interface SendTemplateOptions extends BaseMailOptions {
  idTemplateMailUser: number;
  params?: Record<string, string>;
}

export interface SendRequest {
  idempotencyKey?: string;
  mail: SendMailOptions;
}

export interface SendTemplateRequest {
  idempotencyKey?: string;
  mail: SendTemplateOptions;
}

export interface SendResponse {
  uuid: string;
  additionalRecipients?: any[];
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
}
