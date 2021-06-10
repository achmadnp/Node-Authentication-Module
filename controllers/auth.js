const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const username = req.body.username;
    const displayName = req.body.displayName;
    const password = req.body.password;

    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            name: name,
            password: hashPassword,
            name: name
        });
        const saveUser = await user.save();
        res.status(201).json({
            message: 'User created!',
            userId: saveUser._id
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let signInUser;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            const error = new Error('could not find user with username: ' + username);
            error.statusCode = 401;
            throw error;
        }
        signInUser = user;
        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) {
            const error = new Error('Wrong credentials.');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            username: signInUser.username,
            userId: signInUser._id.toString()
        }, JWT_SECRET_KEY, {
            expiresIn: '1h'
        });
        res.status(200).json({
            token: token,
            userId: signInUser._id.toString()
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(err);
    }
}
