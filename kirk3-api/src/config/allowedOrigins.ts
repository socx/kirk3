import dotenv from "dotenv";

dotenv.config();


export const allowedOrigins = (process.env.ALLOWED_ORIGINS as string)?.split('|').map(origin=>origin);
