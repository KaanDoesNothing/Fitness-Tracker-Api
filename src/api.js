const koa = require("koa");
const koaBody = require("koa-body");
const koaCors = require("@koa/cors");

const router = require("./routes/v1");

const app = new koa();

app.use(koaCors());
app.use(koaBody());

app.use(router.routes());
app.use(router.allowedMethods());

// app.use(proxy({
//     host: "http://localhost:5000/"
// }));


app.listen(5555);