import {jwtDecode} from "./utils";
import {Context, Next} from "koa";
import { User } from "./entities/user";

export const handleSession = async (ctx: Context, next: Next) => {
    let headers = ctx.request.headers;
    if(headers["authorization"]) {
        let token = headers["authorization"].split(" ")[1];

        let decoded: any = jwtDecode(token);

        let user = await User.findOne<User>({where: {email: decoded.email}});

        if(!user) return ctx.body = {error: "Invalid account."};

        ctx.session = decoded;
    }
    await next();
}