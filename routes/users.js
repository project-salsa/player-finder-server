'use strict'

const express = require('express')
const router = express.Router()
const getUser = require('../db/users').getUser
const getUsers = require('../db/users').getUsers
const createUser = require('../db/users').createUser
const editUser = require('../db/users').editUser
const login = require('../auth/login').login
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
    if (typeof reqData[value] === 'undefined' || reqData[value] === '') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  getUser(reqData.username).then((user) => {
    if (typeof user !== 'undefined') {
      response.message = 'username already taken'
      return res.status(400).json(response)
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
      return res.status(201).json(response)
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
    if (typeof user === 'undefined' || user === null) {
      response.message = "Specified username '" + username + "' does not exist"
      return res.status(404).json(response)
    }
    user.password = null
    user.salt = null
    user.iterations = null
    // TODO completely remove the password field from the user object
    response.success = true
    response.user = user
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = err.message
    return res.status(500).json(response)
  })
})

/**
 * Edits a user
 * Request body format:
 * {
 *      currentPassword: String,
 *      editData: {
 *        password: String,
 *        email: String,
 *        subscribedTags: [String],
 *        notificationTags: [String],
 *        discordId: String,
 *        steamId: String,
 *        battleNetId: String,
 *        profilePicUrl: String,
 *        completedFirstTimeSetUp: String
 *     }
 * }
 * Response body format:
 * {
 *     success: Boolean, - true if success, false otherwise
 *     message: String - error message/success message
 * }
 * Response codes:
 * 200 - Successfully edited
 * 400 - User error
 * 404 - No such user
 * 500 - Something went wrong
 */
router.put(path + '/:username', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const tokenUsername = req.user.username
  const username = req.params.username
  const userId = req.user.id
  const editInfo = req.body.editData
  const currentPassword = req.body.currentPassword
  const editableFields = [
    'password',
    'email',
    'subscribedTags',
    'notificationTags',
    'discordId',
    'steamId',
    'battleNetId',
    'profilePicUrl',
    'completedFirstTimeSetUp'
  ]
  if (typeof editInfo === 'undefined' || typeof currentPassword === 'undefined') {
    response.message = 'missing either editData or currentPassword field'
    return res.status(400).json(response)
  }
  if (Object.keys(editInfo).length === 0) {
    response.message = 'editData cannot be empty'
    res.status(400).json(response)
  }
  const editData = {}
  for (const key in editInfo) {
    if (editInfo.hasOwnProperty(key) && editableFields.includes(key)) {
      switch (key) {
        case 'password':
          editData[key] = encrypt(editInfo.password)
          break
        case 'completedFirstTimeSetUp':
          const setup = editInfo[key]
          editData[key] = (setup === true || setup === 'true')
          break
        default:
          editData[key] = editInfo[key]
      }
    } else {
      response.message = 'cannot edit ' + key + ' field'
      return res.status(400).json(response)
    }
  }
  if (tokenUsername !== username) {
    response.message = 'forbidden'
    return res.status(403).json(response)
  }
  login(username, currentPassword).then((success) => {
    if (success === null) {
      response.message = 'user not found'
      return res.status(404).json(response)
    }
    if (!success) {
      response.message = 'wrong password'
      return res.status(401).json(response)
    }
    editUser(userId, editData).then(() => {
      response.success = true
      return res.status(200).json(response)
    }).catch((err) => {
      if (err.code === errorCodes.DUPLICATE_KEY) {
        // username can't be edited, so it must be email
        response.message = 'email already taken'
        return res.status(400).json(response)
      }
      response.message = err.message
      res.status(500).json(response)
    })
  }).catch((err) => {
    response.message = err.message
    res.status(500).json(response)
  })
})

module.exports = {router}
