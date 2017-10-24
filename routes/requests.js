const express = require('express')
const router = express.Router()
const createRequest = require('../db/requests.js').createRequestFromRaw
const getRequest = require('../db/requests').getRequest
const getRequests = require('../db/requests').getRequests

// All paths in this file should start with this
const path = '/requests'

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
    return res.status(500).json(response)
  })
})

/*
 Creates a new request object
 Req body must contain:
    * title: String
    * user: String
    * game: String
    * platform: String
    * tags: [String]
    * location: String
    * maxPlayers: Number
  Response Codes:
    * 201 - Success
    * 400 - Undefined field
    * 500 - Error
 */
router.post(path + '/', (req, res) => {
  const reqData = req.body
  const response = {
    success: false,
    message: ''
  }
  const requiredValues = ['title', 'user', 'game', 'platform', 'tags', 'location', 'maxPlayers']
  for (const value of requiredValues) {
    if (typeof reqData[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or undefined'
      return res.status(400).json(response)
    }
  }

  createRequest(
    reqData.title,
    reqData.user,
    reqData.game,
    reqData.platform,
    reqData.tags,
    reqData.location,
    reqData.maxPlayers
  ).then(() => {
    response.success = true
    res.status(201).json(response)
  }).catch((err) => {
    response.message = err.message
    res.status(500).json(response)
  })
})

router.get(path + '/:requestId', (req, res) => {
  const response = {
    success: false,
    message: '',
    request: null
  }
  getRequest(req.requestId).then((request) => {
    response.success = true
    response.request = request
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = err
    return res.status(500).json(response)
  })
})

router.put(path + '/:requestID', (req, res) => {
  res.send('requestId is set to ' + req.params.requestId)
})

module.exports = {router}
