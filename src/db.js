const thinky = require("thinky")({db: "fitness_tracker"});
const type = thinky.type;
const r = thinky.r;

const User = thinky.createModel("User", {
    id: type.id(),
    email: type.string().email().required(),
    password: type.string().required(),
    createdAt: type.date().default(r.now())
});

const WorkoutTypes = thinky.createModel("WorkoutType", {
    id: type.id(),
    author: type.string().email().required(),
    name: type.string(),
    type: type.string(),
    description: type.string(),
    createdAt: type.date().default(r.now())
});

const Logs = thinky.createModel("Logs", {
    id: type.id(),
    author: type.string().email().required(),
    name: type.string().required(),
    type: type.string(),
    reps: type.number(),
    sets: type.number(),
    duration: type.number(),
    calories: type.number(),
    createdAt: type.date().default(r.now())
});

module.exports = {User, WorkoutTypes, Logs, r}