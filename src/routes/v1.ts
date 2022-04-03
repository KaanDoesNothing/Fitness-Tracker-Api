import koaRouter from "koa-joi-router";
import {Context} from "../types";
import { User } from "../entities/user";
import {comparePassword, hashPassword, jwtSign} from "../utils";
import { handleSession } from "../middlware";
import {Exercise} from "../entities/exercise";
import {Workout} from "../entities/workout";
import { nutritionClient } from "../nutrition";

//@ts-ignore
export const router = new koaRouter();

router.prefix("/api/v1");

router.get("/", (ctx: Context) => {
    ctx.body = {haha: "Seems like you've found the backend!"};
});

router.post("/auth/signup", async (ctx: Context) => {
    let body = ctx.request.body;

    if(!body.email || !body.password) return ctx.body = {error: "No credentials."};

    let existingUser = await User.findOne({where: {email: body.email}});

    if(existingUser) return ctx.body = {error: "User already exists."};

    let hashedPassword: string | null = await hashPassword(body.password);
    if(!hashedPassword) return ctx.body = {error: "Error hashing password."};

    let user = User.create<User>({email: body.email, password: hashedPassword});

    await user.save();
    console.log(user);

    return ctx.body = {token: jwtSign({email: body.email})};
});

router.post("/auth/signin", async (ctx: Context) => {
    let body = ctx.request.body;
    if(!body.email || !body.password) return ctx.body = {error: "No credentials."}

    let user = await User.findOne({where: {email: body.email}});

    if(!user) return ctx.body = {error: "User doesn't exist."}

    let isPasswordCorrect = await comparePassword(body.password, user.password)

    if(!isPasswordCorrect) return ctx.body = {error: "Incorrect password."}

    ctx.body = {token: jwtSign({email: user.email})};
});

router.post("/user/exercises", handleSession, async (ctx: Context) => {
    let exercises = await Exercise.find({where: {author: ctx.session.email}, select: {type: true, name: true}});

    ctx.body = {exercises};
});

router.post("/user/exercises/create", handleSession, async (ctx: Context) => {
    let body = ctx.request.body;

    let email = ctx.session.email;

    let doesExerciseExist = await Exercise.findOne({where:{author: email, name: body.name}});

    if(doesExerciseExist) return ctx.body = {error: "Already exists."};

    let exercise = Exercise.create<Exercise>({...body as Exercise, description: body.description || "", author: email});

    await exercise.save();

    ctx.body = {success: true}
});

router.post("/user/workouts", handleSession, async (ctx: Context) => {
    let workouts = await Workout.find({where: {author: ctx.session.email}, order: {createdAt: "DESC"}});

    ctx.body = {workouts};
});

router.post("/user/workouts/create", handleSession, async (ctx: Context) => {
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

        let newLog = Workout.create(newBody);

        await newLog.save();

        ctx.body = {success: true};
    }else if(body.exercise.type === "cardio") {
        let newBody = {
            author: ctx.session.email,
            type: body.exercise.type,
            name: body.exercise.name,
            duration: body.duration,
            calories: body.calories
        }

        let newLog = Workout.create(newBody);

        await newLog.save();

        ctx.body = {success: true};
    }
});

router.get("/nutrition/search", async (ctx: Context) => {
    let query = ctx.request.query.q as string | null;

    if(!query) return ctx.body = {error: "Must provide a query"};

    let res = await nutritionClient.findProductsBySearchTerm(query);

    ctx.body = {data: res};
});

router.get("/nutrition/product", async (ctx: Context) => {
    let query = ctx.request.query.id as string | null;

    if(!query) return ctx.body = {error: "Must provide a query"};

    let res = await nutritionClient.findProductByBarcode(query);

    ctx.body = {data: res};
});