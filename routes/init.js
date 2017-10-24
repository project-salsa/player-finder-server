'use strict'

/*
    This file compiles all of the different routers into one place, so we just have to export one file
    when routers are needed.

    If you create a router inside of this directory, include it here and make sure to add it to module.exports.
    It also needs to be included inside of app.js, next to the other 'app.use' statements.
 */

const users = require('./users')
const games = require('./games')
const requests = require('./requests')

module.exports = {
  games,
  users,
  requests
}
