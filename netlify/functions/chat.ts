import { Handler } from '@netlify/functions';
import Pusher from 'pusher';
const Filter = require('bad-words');
const filter = new (Filter.default || Filter)();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || '',
  useTLS: true,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, message, type, recipient } = JSON.parse(event.body || '{}');

    if (!username || !message || message.length > 200 || message.length === 0) {
      return { statusCode: 400, body: 'Invalid message' };
    }

    const cleanMessage = filter.clean(message);

    if (type === 'private' && recipient) {
      await pusher.trigger(`embrune-pm-${recipient}`, 'new-message', {
        username,
        message: cleanMessage,
        sender: username,
      });
    } else {
      await pusher.trigger('embrune-chat', 'new-message', {
        username,
        message: cleanMessage,
      });
    }

    return { statusCode: 200, body: 'Message sent' };
  } catch (error) {
    return { statusCode: 500, body: 'Error sending message' };
  }
};
