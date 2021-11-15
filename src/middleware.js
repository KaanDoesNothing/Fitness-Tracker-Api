const {jwtDecode} = require("./utils");
let handleSession = async (ctx, next) => {
    let headers = ctx.request.headers;
    if(headers["authorization"]) {
        let token = headers["authorization"].split(" ")[1];

        ctx.session = jwtDecode(token);
    }
    await next();
}

module.exports = {
    handleSession
}