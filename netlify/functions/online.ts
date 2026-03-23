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
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'OK' };
  }

  try {
    const response = await pusher.get({ 
      path: '/channels/presence-embrune/users' 
    });
    
    if (response.status === 200) {
      const data = await response.json() as { users: { id: string }[] };
      const usernames = data.users.map(u => u.id);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ users: usernames })
      };
    }
    
    return { statusCode: 500, headers, body: 'Failed to fetch users' };
  } catch (error) {
    return { statusCode: 500, headers, body: `Error: ${error}` };
  }
};