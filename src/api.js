const koa = require("koa");
const koaRouter = require("koa-router");
const koaPug = require("koa-pug");
const koaBody = require("koa-body");
const koaCors = require("@koa/cors");
const koaProxy = require("koa-proxy");
const path = require("path");
const {User, Logs, WorkoutTypes, r} = require("./db");
const {handleSession} = require("./middleware");
const {jwtSign, hashPassword, comparePassword} = require("./utils");
const momentjs = require("moment");
const proxy = require("koa-proxy");
const {nutritionClient} = require("./nutrition");

const app = new koa();
app.keys = ["secret"];

app.use(koaCors());
app.use(koaBody());

const pug = new koaPug({app: app, viewPath: path.join(__dirname, "/views")});

const router = new koaRouter({prefix: "/api"});

router.get("/test", (ctx) => {
    ctx.body = {test: true};
});

router.post("/auth/signin", async (ctx) => {
    let body = ctx.request.body;
    if(!body.email || !body.password) return ctx.body = {error: "No credentials."}

    let user = (await User.filter({email: body.email}))[0];

    if(!user) return ctx.body = {error: "User doesn't exist."}

    let isPasswordCorrect = await comparePassword(body.password, user.password)

    if(!isPasswordCorrect) return ctx.body = {error: "Incorrect password."}

    ctx.body = {token: jwtSign({email: user.email})};
});

router.post("/auth/signup", async (ctx) => {
    let body = ctx.request.body;

    if(!body.email || !body.password) return ctx.body = {error: "No credentials."};

    let existingUser = (await User.filter({email: body.email}))[0];
    if(existingUser) return ctx.body = {error: "User already exists."};

    let user = new User({email: body.email, password: await hashPassword(body.password)});

    let res = await user.saveAll();

    return ctx.body = {token: jwtSign({email: body.email})};
});

router.post("/user/exercises", handleSession, async (ctx) => {
    let exercises = await WorkoutTypes.filter({author: ctx.session.email});

    ctx.body = {exercises};
});

router.post("/user/exercises/create", handleSession, async (ctx) => {
    let body = ctx.request.body;

    let email = ctx.session.email;

    let doesExerciseExist = await WorkoutTypes.filter({author: email, name: body.name});

    if(doesExerciseExist.length > 0) return ctx.body = {error: "Already exists."};

    let newExercise = new WorkoutTypes({...body, description: body.description || "", author: email});

    await newExercise.saveAll();

    ctx.body = {success: true}
});

router.post("/user/workouts", handleSession, async (ctx) => {
    let workouts = await Logs.filter({author: ctx.session.email}).orderBy(r.desc("createdAt"));

    ctx.body = {workouts};
});

router.post("/user/workouts/sorted", handleSession, async (ctx) => {
    let workouts = await Logs.filter({author: ctx.session.email}).orderBy(r.desc("createdAt"));

    ctx.body = {workouts: sortWorkouts(workouts)};
});

router.post("/user/workouts/create", handleSession, async (ctx) => {
    let body = ctx.request.body;

    if(body.exercise.type === "weights") {
        let newBody = {
            author: ctx.session.email,
            type: body.exercise.type,
            name: body.exercise.name,
            reps: body.reps,
            sets: body.sets,
            weight: body.weight
        }

        let newLog = new Logs(newBody);

        await newLog.saveAll();

        ctx.body = {success: true};
    }else if(body.exercise.type === "cardio") {
        let newBody = {
            author: ctx.session.email,
            type: body.exercise.type,
            name: body.exercise.name,
            duration: body.duration,
            calories: body.calories
        }

        let newLog = new Logs(newBody);

        await newLog.saveAll();

        ctx.body = {success: true};
    }
});

router.get("/nutrition/search", async (ctx) => {
    let query = ctx.request.query.q;

    let res = await nutritionClient.findProductsBySearchTerm(query);

    ctx.body = {data: res};
});

router.get("/nutrition/product", async (ctx) => {
    let query = ctx.request.query.id;

    let res = await nutritionClient.findProductByBarcode(query);

    ctx.body = {data: res};
});

app.use(router.routes());
app.use(router.allowedMethods());

// app.use(proxy({
//     host: "http://localhost:5000/"
// }));


app.listen(5555);

function sortWorkouts(workouts) {
    let final = {};
    workouts.forEach(workout => {
        let date = new Date(workout.createdAt);

        let workoutDate = date.toLocaleString().split(", ")[0];
        let currentDate = new Date().toLocaleString().split(", ")[0];

        let dateString = `${date.toLocaleString().split(", ")[0]}`;

        if(workoutDate === currentDate) {
            dateString = "Today"
        }

        if(parseInt(workoutDate.split("/")[1]) === parseInt(currentDate.split("/")[1]) - 1) {
            dateString = "Yesterday"
        }

        workout.timeAgo = momentjs(workout.createdAt).fromNow();

        let sorted = final[dateString];

        if(!sorted) final[dateString] = {date: dateString, workouts: []};

        final[dateString].workouts.push(workout);
    });

    return final;
}