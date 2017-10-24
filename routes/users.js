'use strict'

const express = require('express')
const router = express.Router()
const getUsers = require('../db/users').getUsers
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
})

/**
 * Gets a user from a username
 * Response body format:
 * {
 *   success: Boolean - true if success, false otherwise
 *   message: String - error/success message
 *   user: Object - user object with all params besides password
 * }
 * Response codes:
 * 200 - Success
 * 500 - Something went wrong
 */
router.get(path + '/:username', (req, res) => {
  const response = {
    success: false,
    message: '',
    user: null
  }
  getUser(req.params.username).then((user) => {
    delete user['password']
    response.success = true
    response.user = user
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = err.message
    return res.response(500).json(response)
  })
})

router.put(path + '/:username', (req, res) => {
  res.send('username is set to ' + req.params.username)
})

router.get(path + '/:username/requests', (req, res) => {
  res.send('username is set to ' + req.params.username)
})

module.exports = {router}
