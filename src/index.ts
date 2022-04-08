import koa from "koa";
import koaBody from "koa-body";
import koaCors from "koa-cors";

import http from "http";
import * as socketIO from "socket.io";

import * as db from "./db";

db.setup();

import {router as v1} from "./routes/v1";
import {router as v2} from "./routes/v2";

const app = new koa();

app.use(koaCors());
app.use(koaBody());

app.use(v1.middleware());
app.use(v2.middleware());

app.use((ctx: any, next: any) => {
    console.log(`User was trying to access: ${ctx.url}`);

    ctx.body = {error: "Not Found"};

    next();
});

import chat from "./chat";

const server = new http.Server(app.callback());
const io = new socketIO.Server(server, {cors: {methods: ["GET", "POST"]}});

new chat({io});


server.listen(5555);