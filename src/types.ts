import {Context as Default} from "koa";

export interface Context extends Default {
    session: {
        email: string;
    }
}