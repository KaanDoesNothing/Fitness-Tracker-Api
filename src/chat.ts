import {Server} from "socket.io";
import {jwtDecode} from "./utils";
import {Message} from "./entities/message";
import {User} from "./entities/user";

export class ChatHandler {
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

                let res = await newMSG.save();

                msg.createdAt = res.createdAt;

                msg = await finishMessage({msg, author: user.email});

                this.io.emit("message", msg);
            });

            socket.on("setUser", (data) => {
                user = jwtDecode(data.token) as User;
            });

            socket.on("messagedReceived", () => {
                socket.emit("message", this.systemMessage({content: "You are now connected to the public chat."}));
                socket.emit("message", this.systemMessage({content: "Keep it friendly."}));
            });
        });
    }

    systemMessage({content}: {content: string}) {
        return {
            user: {name: "System"},
            content: content,
            createdAt: Date.now()
        }
    }
}

export const finishMessage = async ({msg, author}: any) => {
    let messageAuthor: User | null = await User.findOne({where: {email: author }});

    if(!messageAuthor) return console.log("Error");

    msg.user = {name: messageAuthor.username};

    return msg;
}