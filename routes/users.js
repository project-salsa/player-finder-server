'use strict'

const express = require('express')
const router = express.Router()
const getUser = require('../db/users').getUser
const getUsers = require('../db/users').getUsers
const createUser = require('../db/users').createUser
const encrypt = require('../auth/auth').encrypt
const errorCodes = require('../db/init').errorCodes

// All paths in this file should start with this
const path = '/users'

/**
 * Gets a list of all usernames
 * Response body format:
 * {
*     Success: Boolean,
*     users: [String]
* }
 * Response codes:
 * 200 - Successfully retrieved
 * 500 - Something went wrong
 */
router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    message: '',
    users: null
  }
  getUsers().then((users) => {
    let userNames = []
    for (const user of users) {
      userNames.push(user.username)
    }
    response.success = true
    response.users = userNames
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = err.message
    return res.status(500).json(response)
  })
})

/**
 * Creates a user
 * Request body format:
 * {
*     username: String,
*     password: String,
*     email: String,
*     name: String
* }
 * Response body format:
 * {
*     success: Boolean, - true if success, false otherwise
*     message: String - error message/success message
* }
 * Response codes:
 * 201 - Successfully created
 * 400 - User error
 * 500 - Something went wrong
 */
router.post(path + '/', (req, res) => {
  const reqData = req.body
  const response = {
    success: false,
    message: ''
  }
  const requiredValues = ['username', 'password', 'email']
  for (const value of requiredValues) {
    if (typeof reqData[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  getUser(reqData.username).then((user) => {
    if (typeof user !== 'undefined') {
      response.message = 'username already taken'
      res.status(400).json(response)
    }
    const password = reqData.password
    const username = reqData.username
    const email = reqData.email

    const passInfo = encrypt(password)
    const epass = passInfo.epass
    const salt = passInfo.salt
    const iterations = passInfo.iterations

    createUser(username, epass, salt, iterations, email).then(() => {
      response.success = true
      res.status(201).json(response)
    }).catch((err) => {
      if (err.code === errorCodes.DUPLICATE_KEY) {
        // Already checked for username, so it must be email
        response.message = 'email already taken'
        return res.status(400).json(response)
      }
      response.message = err.message
      return res.status(500).json(response)
    })
  })
})

/**
 * Gets a user from a username
 * Response body format:
 * {
 *   success: Boolean - true if success, false otherwise
 *   message: String - error/success message
 *   user: Object - user object with all params besides password, null by default in case of failure
 * }
 * Response codes:
 * 200 - Success
 * 404 - Username does not exist
 * 500 - Something went wrong
 */
router.get(path + '/:username', (req, res) => {
  const username = req.params.username
  const response = {
    success: false,
    message: '',
    user: null
  }
  getUser(username).then((user) => {
    if (user === undefined) {
      response.message = "Specified username '" + username + "' does not exist"
      return res.status(404).json(response)
    }
    user.password = null
    // TODO completely remove the password field from the user object
    response.success = true
    response.user = user
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = err.message
    return res.status(500).json(response)
  })
})

router.put(path + '/:username', (req, res) => {
  // This is how to get the username of the signed in user
  const tokenUsername = req.user.username
  const username = req.params.username
  const response = {
    success: false,
    message: ''
  }
  if (tokenUsername !== username) {
    response.message = 'forbidden'
    return res.status(403).json(response)
  }
  res.send('username is set to ' + req.params.username)
})

router.get(path + '/:username/requests', (req, res) => {
  res.send('username is set to ' + req.params.username)
})

module.exports = {router}
