import dotenv from 'dotenv';

dotenv.config();

export const PORT: string | number = process.env.PORT || 3000;
export const HOST: string = process.env.HOST || 'localhost';
export const CLIENT_VERSION: string = process.env.CLIENT_VERSION || '1.0.0';
