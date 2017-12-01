const express = require('express')
const router = express.Router()
const createRequest = require('../db/requests.js').createRequestFromRaw
const getPopulatedRequest = require('../db/requests').getPopulatedRequest
const getRequests = require('../db/requests').getRequests
const joinRequest = require('../db/requests').joinRequest
const leaveRequest = require('../db/requests').leaveRequest

// All paths in this file should start with this
const path = '/requests'

/**
 * Returns all requests in the database
 * Response body:
    * success: Boolean - true if successful, false otherwise
    * message: String - contains error message if query fails
    * requests: [Object] - returns an array of request Objects if successful, null otherwise
 * Response Codes:
    * 200: Success
    * 500: Something went wrong
 */
router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    message: '',
    requests: null
  }
  getRequests().then((requests) => {
    response.requests = requests
    response.success = true
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = err
    // TODO Log error instead of printing it
    console.log(err)
    return res.status(500).json(response)
  })
})

/**
 * Creates a new request object
 * Req body must contain:
    * title: String
    * user: String
    * game: String
    * platform: String
    * tags: [String]
    * location: String
    * maxPlayers: Number
 * Response Codes:
    * 201 - Success
    * 400 - Undefined field
    * 500 - Error
 */
router.post(path + '/', (req, res) => {
  const reqData = req.body
  const response = {
    success: false,
    message: '',
    requestId: ''
  }
  const requiredValues = ['title', 'user', 'game', 'platform', 'tags', 'location', 'maxPlayers']
  for (const value of requiredValues) {
    if (typeof reqData[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or undefined'
      return res.status(400).json(response)
    }
  }
  const tokenUsername = req.user.username
  const username = reqData.user
  if (tokenUsername !== username) {
    response.message = 'forbidden'
    return res.status(403).json(response)
  }
  createRequest(
    reqData.title,
    reqData.user,
    reqData.game,
    reqData.platform,
    reqData.tags,
    reqData.location,
    reqData.maxPlayers
  ).then((data) => {
    response.success = true
    response.requestId = data._id
    res.status(201).json(response)
  }).catch((err) => {
    response.message = err.message
    res.status(500).json(response)
  })
})

/**
 * Returns a specific request given a requestId
 * Response body:
    * success: Boolean - true if successful, false otherwise
    * message: String - returns error message if query fails
    * request: Object - returns a request Object if one is found, null otherwise
 * Response codes:
    * 200: Success
    * 404: Request not found
    * 500: Something went wrong
 */
router.get(path + '/:requestId', (req, res) => {
  const response = {
    success: false,
    message: '',
    request: null
  }
  getPopulatedRequest(req.params.requestId).then((request) => {
    if (request === null) {
      response.message = 'Specified request object ' + req.params.requestId + ' does not exist'
      return res.status(404).json(response)
    }
    response.success = true
    response.request = request
    return res.status(200).json(response)
  }).catch((err) => {
    console.log(err)
    response.message = err
    return res.status(500).json(response)
  })
})

router.put(path + '/:requestId', (req, res) => {
  // TODO Make sure logged in user is same as user on request
  res.send('requestId is set to ' + req.params.requestId)
})

router.post(path + '/:requestId/join', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const username = req.user.username
  const requestId = req.params.requestId
  joinRequest(username, requestId).then(() => {
    response.success = true
    return res.status(200).json(response)
  }).catch((err) => {
    if (err === 'Request not found') {
      response.message = 'not a valid requestId'
      return res.status(404).json(response)
    }
    console.log(err) // TODO Log error properly
    response.message = err
    return res.stat(500).json(response)
  })
})

router.post(path + '/:requestId/leave', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const username = req.user.username
  const requestId = req.params.requestId
  leaveRequest(username, requestId).then(() => {
    response.success = true
    return res.status(200).json(response)
  }).catch((err) => {
    if (err === 'Request not found') {
      response.message = 'not a valid requestId'
      return res.status(404).json(response)
    }
    console.log(err) // TODO Log error properly
    response.message = err
    return res.stat(500).json(response)
  })
})

module.exports = {router}
