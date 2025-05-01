import { createServer } from "./server";

const PORT: Number = parseInt(process.env.PORT as string, 10) || 3001;

const server = createServer();

server.listen(PORT, () => {
  console.log(`api running on ${PORT}`);
});
