
require('dotenv').config()
const os                               = require('os');
const pjson                            = require('../package.json');
const utils                            = require('../libs/utils');
const SERVICE_NAME                     = (process.env.SERVICE_NAME)? utils.slugify(process.env.SERVICE_NAME):pjson.name;
const USER_PORT                        = process.env.USER_PORT || 5111;
const ADMIN_PORT                       = process.env.ADMIN_PORT || 5222;
const ADMIN_URL                        = process.env.ADMIN_URL || `http://localhost:${ADMIN_PORT}`;
const ENV                              = process.env.ENV || "development";

const MONGO_URI                        = process.env.MONGO_URI || `mongodb://localhost:27017/${SERVICE_NAME}`;
const CACHE_PREFIX                     = process.env.CACHE_PREFIX || 'cache_';
const CACHE_REDIS                      = process.env.CACHE_REDIS || null;
const CORTEX_PREFIX                    = process.env.CORTEX_PREFIX || 'cortex_';
const CORTEX_REDIS                     = process.env.CORTEX_REDIS || null;
const CORTEX_TYPE                      = process.env.CORTEX_TYPE || 'redis';

const config                           = require(`./envs/${ENV}.js`);
const LONG_TOKEN_SECRET                = process.env.LONG_TOKEN_SECRET || null;
const SHORT_TOKEN_SECRET               = process.env.SHORT_TOKEN_SECRET || null;
const NACL_SECRET                      = process.env.NACL_SECRET || null;

if(!LONG_TOKEN_SECRET || !SHORT_TOKEN_SECRET || !NACL_SECRET) {
    throw Error('missing .env variables check index.config');
}

config.dotEnv = {
    SERVICE_NAME,
    ENV,
    MONGO_URI,
    USER_PORT,
    ADMIN_PORT,
    ADMIN_URL,
    CACHE_PREFIX,
    CACHE_REDIS,
    CORTEX_PREFIX,
    CORTEX_REDIS,
    CORTEX_TYPE,
    LONG_TOKEN_SECRET,
    SHORT_TOKEN_SECRET,
    NACL_SECRET,
};


module.exports = config;
