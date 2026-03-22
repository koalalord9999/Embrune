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
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    let body;
    // Pusher client might send x-www-form-urlencoded or JSON
    if (event.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(event.body || '');
      body = Object.fromEntries(params);
    } else {
      body = JSON.parse(event.body || '{}');
    }

    const { socket_id, channel_name, username } = body;

    if (!socket_id || !channel_name || !username) {
      return { statusCode: 400, headers, body: 'Missing required parameters (socket_id, channel_name, username)' };
    }

    const authResponse = pusher.authorizeChannel(socket_id, channel_name, {
      user_id: username,
      user_info: { username }
    });

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authResponse),
    };
  } catch (error) {
    console.error('Error in pusher-auth function:', error);
    return { statusCode: 500, headers, body: `Server error: ${error}` };
  }
};
