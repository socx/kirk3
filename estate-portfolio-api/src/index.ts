import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";

import { connectDB } from "./config/dbConn";

dotenv.config();

const PORT: Number = parseInt(process.env.PORT as string, 10) || 3535;

// Connect to DB
connectDB();

const app: Express = express();

// built-in middleware for json 
app.use(express.json())

app.use(bodyParser.json());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended : true}))

// Cross Origin Resource Sharing
app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get('/server-status',  (req: Request, res: Response) => {
  res.json({ message: 'Estate Portfolio API Server is up and running' });
});

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
