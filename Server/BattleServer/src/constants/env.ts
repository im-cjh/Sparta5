import dotenv from "dotenv";

dotenv.config();

export const PORT: number = parseInt(process.env.PORT || "3005", 10);
export const HOST: string = process.env.HOST || "127.0.0.1";
export const CLIENT_VERSION: string = process.env.CLIENT_VERSION || "1.0.0";

export const LOBBY_PORT: number = 3000;
export const LOBBY_HOST: string = "127.0.0.1";
