const user_service = require('../services/user_service');
const { validationResult } = require('express-validator');
const Hash = require('../utility/bycrpt_hashing');
const user_controller = {};

user_controller.login = async (req, res) => {
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user_data = await user_service.user_login(data);
        res.status(200).json({ msg: 'user logged in ', data: user_data });
    } catch (error) {
        res.status(400).json({ message: "user wasn't signed in", error });
        console.log(error);
    }
};

user_controller.setPin = async (req, res) => {
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const hashed_pin = await Hash(data.pin.toString());
        console.log(hashed_pin);
        const setPin = await user_service.update_pin(req.USER_ID, hashed_pin);
        console.log(setPin);
        res.status(200).json({ msg: 'Your Transaction Pin has been set succssfully' });
    } catch (error) {
        res.status(400).json({ msg: 'Error occured', error: error });
    }
};

user_controller.view_transactions = async (req, res) => {
    try {
        const user_transactions = await user_service.view_all_user_transactions(req.USER_ID);
        res.status(200).json({ msg: 'All your transactions', user_transactions: user_transactions });
    } catch (error) {
        res.status(400).json({ msg: 'Error occured', error: error });
    }
};

module.exports = user_controller;