const koa = require("koa");
const koaBody = require("koa-body");
const koaCors = require("@koa/cors");

const router = require("./routes/v1");
const v2 = require("./routes/v2");

const app = new koa();

app.use(koaCors());
app.use(koaBody());

// app.use(router.middleware());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(v2.middleware());

app.use((ctx, next) => {
    ctx.body = {error: "Not Found"};

    next();
});

// app.use(proxy({
//     host: "http://localhost:5000/"
// }));


app.listen(5555);