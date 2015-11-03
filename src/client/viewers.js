import io from 'socket.io-client';

let socket = io('https://api.michigan.com', { transports: ['websocket', 'xhr-polling'] });
