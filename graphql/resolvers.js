const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = {
    createUser: async function({ userInput }, req) {

        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'E-Mail is invalid.' });
        }
        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })
        ) {
            errors.push({ message: 'Password too short!' });
        }
        if (
            validator.isEmpty(userInput.displayName)) {
            errors.push({ message: 'Password too short!' });
        }
        if (
            validator.isEmpty(userInput.username) ||
            !validator.isLength(userInput.username, { min: 8 })) {
            errors.push({ message: 'Password too short!' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingEmail = await User.findOne({ email: userInput.email });
        if (existingEmail) {
            const error = new Error('Email already registered!');
            throw error;
        }
        const existingUsername= await User.findOne({ username: userInput.username });
        if (existingUsername) {
            const error = new Error('Username already exists!');
            throw error;
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
    login: async function({ username, password }) {
        const user = await User.findOne({ username: username });
        if (!user) {
            const error = new Error('User not found.');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) {
            const error = new Error('Wrong credentials.');
            error.code = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                username: user.username
            },
            'THISISREALLYREALLYSUPERDUPERSAFESECURITYKEY',
            {
                expiresIn: '1h',
            }
        );
        return { token: token, userId: user._id.toString() };
    },
    user: async function(args, req) {
        if (!req.isAuth) {
            const error = new Error('Error: Not authenticated!');
            error.code = 401;
            throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('No user found!');
            error.code = 404;
            throw error;
        }
        return {...user._doc, _id: user._id.toString()};
    }
};