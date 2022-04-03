import koa from "koa";
import koaBody from "koa-body";
import koaCors from "koa-cors";

import * as db from "./db";

db.setup();

import {router as v2} from "./routes/v2";

const app = new koa();

app.use(koaCors());
app.use(koaBody());

app.use(v2.middleware());

app.use((ctx: any, next: any) => {
    ctx.body = {error: "Not Found"};

    next();
});


app.listen(5555);