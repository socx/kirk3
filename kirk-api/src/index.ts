import { createServer } from "./server";
import sequelize from "./database/db-connection";


const PORT: Number = parseInt(process.env.PORT as string, 10) || 3001;

const server = createServer();

const start = async (): Promise<void> => {
  try {
    sequelize.authenticate();
    console.log('Database Connection has been established successfully.');

    server.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();