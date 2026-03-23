import { Handler } from '@netlify/functions';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || '',
  useTLS: true,
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'OK' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 200, headers, body: 'Not a POST request' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const events = body.events || [];

    for (const webhookEvent of events) {
      if (webhookEvent.name === 'member_removed' && webhookEvent.channel === 'presence-embrune') {
        const userId = webhookEvent.user_id;
        
        await pusher.trigger('embrune-chat', 'new-message', {
          username: 'System',
          message: `${userId} has logged out.`,
          type: 'system',
          timestamp: Date.now(),
        });
      }
    }

    return { statusCode: 200, headers, body: 'OK' };
  } catch (error) {
    console.error('Error processing Pusher webhook:', error);
    return { statusCode: 200, headers, body: 'Error processing webhook' };
  }
};
