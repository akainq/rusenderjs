# RuSender.ru API Client

Node.js/TypeScript client library for the [RuSender.ru](https://rusender.ru) Email API.

## Installation

```bash
npm install rusenderjs
# or
pnpm add rusenderjs
# or
bun add rusenderjs
```

## Usage

### Initialize Client

```typescript
import { RuSenderClient } from 'rusenderjs';

const client = new RuSenderClient('YOUR_API_KEY');
```

### Send Email

```typescript
try {
  const response = await client.sendMail({
    to: {
      email: 'recipient@example.com',
      name: 'Recipient Name'
    },
    from: {
      email: 'sender@example.com', // Must be a verified sender in RuSender
      name: 'Sender Name'
    },
    subject: 'Hello from RuSender',
    html: '<h1>Hello!</h1><p>This is a test email.</p>',
    text: 'Hello! This is a test email.',
    // Optional
    previewTitle: 'Brief preview text',
    attachments: [
      { 'document.pdf': 'base64_encoded_content_here...' }
    ]
  });

  console.log('Email sent:', response.uuid);
} catch (error) {
  console.error('Error sending email:', error);
}
```

### Send using Template

```typescript
try {
  const response = await client.sendByTemplate({
    to: { email: 'recipient@example.com' },
    from: { email: 'sender@example.com' },
    subject: 'Template Email',
    idTemplateMailUser: 12345, // Your template ID
    params: {
      variable1: 'value1',
      variable2: 'value2'
    }
  });

  console.log('Template email sent:', response.uuid);
} catch (error) {
  console.error('Error:', error);
}
```

## Features

- TypeScript support with full type definitions
- Promise-based API
- Supports HTML and Text emails
- Supports Template sending
- Error handling
- Attachments support

## License

ISC

