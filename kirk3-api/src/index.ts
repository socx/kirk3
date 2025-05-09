import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

// import User from  "./database/models/user";
import sequelize from "./dbase/dbConnection";
// import sequelize from "./db/connection";
import { User } from "./dbase/models/userModel";

import { connectDB } from "./config/dbConn";
import { corsOptions } from "./config/corsOptions";
import { credentials } from "./middlewares/credentials";
import { logger } from "./middlewares/logEvents";

import { userRouter } from "./routes/userRoutes";

dotenv.config();

const PORT: Number = parseInt(process.env.PORT as string, 10) || 3030;

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

// app.get("/tests", async (req, res) => {
//   try{
//     console.log('got here!')
//     res.send(await User.findAll({
//     }))
//   }catch(err){
//     console.error(err);
//     res.status(500).send("Unexpected error occurred on server!");
//   }
// })

// app.get("/tests", async (req, res) => {
//     try{
//     console.log('got here!')
//     res.send(await sequelize.sync())
//   }catch(err){
//     console.error(err);
//     res.status(500).send("Unexpected error occurred on server!");
//   }
  
// });

// (async () => {
//   console.log('got here')
//   await sequelize.sync();
//   User.create({
//     fullname: 'John',
//     email: 'john@doe.com',
//     password: 'sdasd'
//   });
//   console.log('fot here')
// })()

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

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`🗄️  MongoDb Server is listening on port ${PORT}`));
});

// const db_port = process.env.DB_PORT || 3306;
// app.listen(db_port, () => {
//   console.log('Connected to MySql DB');
//   console.log(`🚀 MySql DB Server is listening on port ${db_port}`)
// })

const start = async (): Promise<void> => {
  try {
    sequelize.authenticate();
    console.log('Database Connection has been established successfully.');

    // server.listen(PORT, () => {
    //   console.log(`🚀 Server running on ${PORT}`);
    // });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();