const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = "075";

const jwtSign = (data) => {
    return jwt.sign(data, secret);
}

const jwtDecode = (token) => {
    return jwt.verify(token, secret);
}

const hashPassword = async (password, saltRounds = 10) => {
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

const comparePassword = async (password, hash) => {
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