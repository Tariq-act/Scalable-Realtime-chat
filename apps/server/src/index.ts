import http from "http";

import SocketService from "./services/socket";

async function init() {

  const socketServices = new SocketService()

  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketServices.io.attach(httpServer);

  httpServer.listen(PORT, () => console.log(`HTTP Server started at PORT:${PORT}`));
}

init();