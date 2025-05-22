const validator = require('validator');

const validateSignupData = (data) => {
    const ALLOWED_KEYS = [
        "userName", "firstName", "lastName", "emailId", "password",
        "age", "gender", "profilePictureUrl", "additionalPictures",
        "about", "skills", "interest", "lookingFor", "location"
    ];

    const isCreateAllowed = Object.keys(data).every(k => ALLOWED_KEYS.includes(k));
    if (!isCreateAllowed) {
        throw new Error("Extra parameters are not allowed in signup");
    }

    const { userName, firstName, lastName, age, gender, emailId, password } = data;

    if (!userName) throw new Error("Username is required");
    if (!firstName) throw new Error("First name is required");
    if (!lastName) throw new Error("Last name is required");
    if (!age || isNaN(age) || age < 18) throw new Error("Valid age (18+) is required");
    if (!gender || !["male", "female", "others"].includes(gender.toLowerCase())) {
        throw new Error("Gender must be 'male', 'female' or 'others'");
    }
    if (!emailId || !validator.isEmail(emailId)) throw new Error("email is invalid");
    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Password must be strong (include uppercase, lowercase, number, and special char)");
    }
};

const validateProfileData = (req) => {
    const ALLOWED_EDIT_KEYS = [
        "userName", "firstName", "lastName",
        "age", "gender", "profilePictureUrl", "additionalPictures",
        "about", "skills", "interest", "lookingFor", "location"
    ];

    const isCreateAllowed = Object.keys(req.body).every(k => ALLOWED_EDIT_KEYS.includes(k));
    return isCreateAllowed;
}

module.exports = { validateSignupData, validateProfileData };
