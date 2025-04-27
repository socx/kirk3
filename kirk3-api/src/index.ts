import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

import { connectDB } from "./config/dbConn";
import { corsOptions } from "./config/corsOptions";
import { credentials } from "./middlewares/credentials";
import { logger } from "./middlewares/logEvents";

import { userRouter } from "./routes/userRoutes";
import { assetRouter } from "./routes/assetRoutes";

dotenv.config();

const PORT: Number = parseInt(process.env.PORT as string, 10) || 4040;

// Connect to DB
connectDB();

const app: Express = express();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended : true}));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get('/server-status',  (req: Request, res: Response) => {
  res.json({ message: 'Estate Portfolio API Server is up and running' });
});

app.use('/users', userRouter);
app.use('/assets', assetRouter);

app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`🗄️ Server is listening on port ${PORT}`));
});
