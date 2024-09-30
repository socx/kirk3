import cors from "cors";
import { allowedOrigins } from "./allowedOrigins";

export type CallbackType = (origin: Error | null, callback?: boolean | string) => void;

const customOrigin = (origin: string | undefined, callback: CallbackType) => {
  if (!origin || allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true)
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}

export const corsOptions: cors.CorsOptions = {
  origin: customOrigin,
  credentials: true,
  optionsSuccessStatus: 200
}
