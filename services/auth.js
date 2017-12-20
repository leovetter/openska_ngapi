'use strict';

const jwt = require('jsonwebtoken');

const config = require('../services/config');

/**
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function authCheck(req, res, next) {

  let authHeader = req.get('Authorization') || '';

  let [, token = null] = authHeader.match(/^Bearer (.*)/) || [];

  if (token) {

    try {
      jwt.verify(token, config.jwtSecret);
    } catch (error) {
      res.sendStatus(401).end();
      return;
    }

  }

  next();

}

module.exports = authCheck;
