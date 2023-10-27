import io from 'socket.io-client';
import './interceptors/interceptors';

export const httpHost =
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:3000/'
    : 'http://43.139.65.158:3000/';
export const wsHOST =
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:3001/'
    : 'http://43.139.65.158:3001/';

export const socket = io(wsHOST);
