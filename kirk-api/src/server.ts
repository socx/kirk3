import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import path  from"path";
import dotenv from "dotenv";

import { financeCategoryRouter } from "./routes/financeCategoryRoutes";
import { permissionRouter } from "./routes/permissionRoutes";
import { userPermissionRouter } from "./routes/userPermissionRoutes";
import { userRouter } from "./routes/userRoutes";
import { expenseRouter } from "./routes/expenseRoutes";


dotenv.config();

export const createServer = () => {
  const app: Express = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use(bodyParser.json());

  app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/views/index.html");
  });

  app.get("/status", (req: Request, res: Response) => {
    res.json({ message: 'Server is up and running' });
  });

  app.use('/expenses', expenseRouter);
  app.use('/finance-categories', financeCategoryRouter);
  app.use('/permissions', permissionRouter);
  app.use('/user-permissions', userPermissionRouter);
  app.use('/users', userRouter);

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

  return app;
};
