const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
require('dotenv').config()

const jwtSecret = require('./vars').TOKEN_SECRET

const routers = require('./routes/init')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Add JSON Web Token functionality
const jwtConfig = {
  secret: jwtSecret
}
const unsecuredPaths = ['/login', '/users']
const unlessConfig = {
  path: unsecuredPaths
}
app.use('/', jwt(jwtConfig).unless(unlessConfig))

app.use('/', routers.requests.router)
app.use('/', routers.users.router)
app.use('/', routers.games.router)
app.use('/', routers.login.router)

// Error handler for missing jwt
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    const response = {
      success: false,
      message: 'unauthorized'
    }
    res.status(401).json(response)
  }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
