import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs/promises";

let secret = "";

(async () => {
    let config = JSON.parse(await fs.readFile("./config.json", "utf-8"));

    secret = config.hashing.secret;
})();

let jwtSign = (data: any) => {
    return jwt.sign(data, secret);
}

let jwtDecode = (token: string) => {
    return jwt.verify(token, secret);
}

let hashPassword = async (password: string, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
};

let comparePassword = async (password: string, hash: string) => {
    try {
        // Compare password
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.log(error);
    }

    // Return false if error
    return false;
};

export {
    jwtSign,
    jwtDecode,
    hashPassword,
    comparePassword
}