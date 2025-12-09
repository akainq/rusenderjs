import { describe, it, expect, beforeAll } from 'bun:test';
import { RuSenderClient } from '../src/index';

const API_KEY = process.env.RUSENDER_API_KEY || 'test-api-key';
const TO_EMAIL = process.env.TEST_TO_EMAIL || 'example@example.com';
const FROM_EMAIL = process.env.TEST_FROM_EMAIL || 'info@example.com';

describe('RuSenderClient', () => {
  let client: RuSenderClient;

  beforeAll(() => {
    client = new RuSenderClient(API_KEY);
  });

  it('should be instantiated', () => {
    expect(client).toBeDefined();
  });

  it('should throw error if neither html nor text is provided', async () => {
    try {
        await client.sendMail({
            to: { email: TO_EMAIL },
            from: { email: FROM_EMAIL },
            subject: 'Test Subject'
        });
    } catch (e: any) {
        expect(e.message).toContain('At least one of "html" or "text" fields must be provided');
    }
  });

  // Note: Real API calls require a valid API key and will consume credits/quota.
  // To run integration tests, set RUSENDER_API_KEY environment variable.
  if (process.env.RUSENDER_API_KEY) {
      it('should send an email (Integration)', async () => {
        const response = await client.sendMail({
          to: { email: TO_EMAIL },
          from: { email: FROM_EMAIL },
          subject: 'Integration Test',
          text: 'This is a test email from RuSenderClient integration test.',
          html: '<h1>Integration Test</h1><p>This is a test email from <b>RuSenderClient</b> integration test.</p>'
        });

        console.log('Send response:', response);
        expect(response).toBeDefined();
        expect(response.uuid).toBeDefined();
      });
  } else {
      console.warn('Skipping integration tests. Set RUSENDER_API_KEY to run them.');
  }
});

