'use strict'

const express = require('express')
const router = express.Router()
const users = require('../db/users')

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

  users.createUser(reqData.username, reqData.password, reqData.email).then(() => {
    response.success = true
    res.status(201).json(response)
  }).catch((err) => {
    response.message = err.message
    // figure out if it was their fault or ours
    res.status(500).json(response)
  })
})

router.get(path + '/:username', (req, res) => {
  res.send('username is set to ' + req.params.username)
})  

router.put(path + '/:username', (req, res) => {
  res.send('username is set to ' + req.params.username)
})

router.get(path + '/:username/requests', (req, res) => {
  res.send('username is set to ' + req.params.username)
})

module.exports = {router}
