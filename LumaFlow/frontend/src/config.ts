export const FLASK_SERVER_URL = import.meta.env.VITE_FLASK_SERVER_URL || 'http://localhost:5000';
export const getSocketIOURL = () => `${FLASK_SERVER_URL}`;

