import { Server, Socket } from "socket.io";
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const pub = new Redis(
  {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  }
);
const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Server...");
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*'
      }
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on('connect', socket => {
      console.log(`New Socket Connected`, socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Received.", message);
        // Publish this message to redis
        await pub.publish('MESSAGES', JSON.stringify({ message }));
      })
    })

    sub.on('message', (channel, message) => {
      if (channel === 'MESSAGES') {
        console.log("new message was received from redis");

        io.emit("message", message);
      }
    })

  }

  get io() {
    return this._io;
  }
}

export default SocketService