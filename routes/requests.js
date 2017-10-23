'use strict'

const express = require('express')
const router = express.Router()
const createRequest = require('../db/requests.js').createRequest

// All paths in this file should start with this
const path = '/requests'

router.get(path + '/', (req, res) => {
})

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

  createRequest(reqData.title, reqData.user, reqData.game, reqData.platform, reqData.tags, reqData.location, reqData.maxPlayers).then(() => {
    response.success = true
    res.status(201).json(response)
  }).catch((err) => {
    response.message = err.message
    res.status(500).json(response)
  })
})

router.get(path + '/:requestId', (req, res) => {
  res.send('requestId is set to ' + req.params.requestId)
})

router.put(path + '/:requestID', (req, res) => {
  res.send('requestId is set to ' + req.params.requestId)
})

module.exports = {router}
