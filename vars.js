'use strict'

const _ = require('lodash')

module.exports = {
  DB_HOST: _.defaultTo(process.env.DB_HOST, 'mongodb'),
  DB_PORT: _.defaultTo(process.env.DB_PORT, 27017),
  DB_USER: _.defaultTo(process.env.DB_USER, ''),
  DB_PASS: _.defaultTo(process.env.DB_PASS, ''),
  DB_NAME: _.defaultTo(process.env.DB_NAME, 'tangled'),
  HOST: _.defaultTo(process.env.HOST, 'localhost'),
  PORT: _.defaultTo(process.env.PORT, 3000),
  PASSWORD_SECRET: _.defaultTo(process.env.PASSWORD_SECRET, 'secret'),
  TOKEN_SECRET: _.defaultTo(process.env.TOKEN_SECRET, 'token_secret'),
  TOKEN_EXPIRE_TIME: _.defaultTo(process.env.TOKEN_EXPIRE_TIME, '1d')
}
