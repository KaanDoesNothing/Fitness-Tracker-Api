import {Server} from "socket.io";
import {jwtDecode} from "./utils";
import {Message} from "./entities/message";
import {User} from "./entities/user";

export default class ChatHandler {
    private io: Server;

    constructor({io}: {io: Server}) {
        this.io = io;

        this.main()
    }

    main() {
        this.io.on("connection", (socket) => {
            let user: User;

            console.log("Connected");

            socket.on("message", async (msg) => {
                if(msg.content.length < 1) return;

                let newMSG = await Message.create({
                    author: user.email,
                    content: msg.content
                });

                newMSG.save();

                this.io.emit("message", msg);
            });

            socket.on("setUser", (data) => {
                user = jwtDecode(data.token) as User;
            });
        });
    }
}