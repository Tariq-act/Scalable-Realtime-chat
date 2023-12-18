import { Server, Socket } from "socket.io";
import Redis from 'ioredis';

const pub = new Redis(
  {
    host: 'redis-1a3fd6ad-tarikkhan10178-e126.a.aivencloud.com',
    port: 23288,
    username: 'default',
    password: 'AVNS_cdHU2zJt5H4BlYfTxGO'
  }
);
const sub = new Redis({
  host: 'redis-1a3fd6ad-tarikkhan10178-e126.a.aivencloud.com',
  port: 23288,
  username: 'default',
  password: 'AVNS_cdHU2zJt5H4BlYfTxGO'
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