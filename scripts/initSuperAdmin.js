const mongoose = require('mongoose');
const User = require('../managers/models/User');
require('dotenv').config();

const initSuperAdmin = async () => {
    try {
        const superadminUser = process.env.INIT_SUPERADMIN_USER;
        const superadminPassword = process.env.INIT_SUPERADMIN_PW;

        const existingUser = await User.findOne({ username: superadminUser });
        if (existingUser) {
            console.log('Superadmin user already exists.');
            return;
        }

        const superadmin = new User({
            username: superadminUser,
            email: 'superadmin@example.com',
            password: superadminPassword,
            role: 'superadmin',
        });

        await superadmin.save();
        console.log('Superadmin user created successfully.');
    } catch (error) {
        console.error('Error creating superadmin user:', error);
    } 
}
module.exports = initSuperAdmin;