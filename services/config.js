'use strict';

const configPath = '../server.conf.json';

/** @type {{ jwtSecret: string }} */
const config = require(configPath);

module.exports = config;
