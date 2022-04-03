import {jwtDecode} from "./utils";
import {Context, Next} from "koa";

export const handleSession = async (ctx: Context, next: Next) => {
    let headers = ctx.request.headers;
    if(headers["authorization"]) {
        let token = headers["authorization"].split(" ")[1];

        ctx.session = jwtDecode(token);
    }
    await next();
}