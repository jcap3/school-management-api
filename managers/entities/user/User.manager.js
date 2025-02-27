const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = class UserManager { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        this.httpExposed         = ['post=createUser', 'post=login'];
    }
    
    async createUser(data) {

        try {
            const user = new User(data);
            await user.save();
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async login({ username, password }) {
        try {
            
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('Invalid username or password.');
            }
            console.log('user:', user);
    
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('isMatch:', isMatch);
            if (!isMatch) {
                throw new Error('Invalid username or password.');
            } 

            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            }); 
            
            console.log('token:', token);
            return { success: true, token };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

}
