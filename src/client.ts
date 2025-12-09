import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  SendMailOptions,
  SendTemplateOptions,
  SendResponse,
  SendRequest,
  SendTemplateRequest
} from './types';

export class RuSenderError extends Error {
  public statusCode?: number;
  public responseData?: any;

  constructor(message: string, statusCode?: number, responseData?: any) {
    super(message);
    this.name = 'RuSenderError';
    this.statusCode = statusCode;
    this.responseData = responseData;
  }
}

export class RuSenderClient {
  private readonly client: AxiosInstance;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: 'https://api.rusender.ru/api/v1',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    });
  }

  /**
   * Send a regular email (HTML or Text)
   * @param options Email options
   * @param idempotencyKey Optional key for idempotency
   */
  public async sendMail(options: SendMailOptions, idempotencyKey?: string): Promise<SendResponse> {
    // Validate that at least one of html or text is present
    if (!options.html && !options.text) {
      throw new Error('At least one of "html" or "text" fields must be provided.');
    }

    const payload: SendRequest = {
      idempotencyKey,
      mail: options,
    };

    return this.request<SendResponse>('/external-mails/send', payload);
  }

  /**
   * Send an email using a template
   * @param options Template email options
   * @param idempotencyKey Optional key for idempotency
   */
  public async sendByTemplate(options: SendTemplateOptions, idempotencyKey?: string): Promise<SendResponse> {
    const payload: SendTemplateRequest = {
      idempotencyKey,
      mail: options,
    };

    return this.request<SendResponse>('/external-mails/send-by-template', payload);
  }

  private async request<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const responseData = error.response?.data;
        const message = responseData?.message || error.message;

        throw new RuSenderError(message, statusCode, responseData);
      }
      throw error;
    }
  }
}

