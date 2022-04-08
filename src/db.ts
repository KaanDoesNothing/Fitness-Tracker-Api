import { createConnection } from "typeorm";
import fs from "fs/promises";
import {User} from "./entities/user";
import {Exercise} from "./entities/exercise";
import {Workout} from "./entities/workout";
import {Message} from "./entities/message";

export const setup = async () => {
    const config = JSON.parse(await fs.readFile("./config.json", "utf-8"));

    await createConnection({
        ...config.db,
        entities: [User, Exercise, Workout, Message]
    });

    console.log("Connected to db");
}