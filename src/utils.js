const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = "075";

let jwtSign = (data) => {
    return jwt.sign(data, secret);
}

let jwtDecode = (token) => {
    return jwt.verify(token, secret);
}

let hashPassword = async (password, saltRounds = 10) => {
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

let comparePassword = async (password, hash) => {
    try {
        // Compare password
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.log(error);
    }

    // Return false if error
    return false;
};

module.exports = {
    jwtSign,
    jwtDecode,
    hashPassword,
    comparePassword
}