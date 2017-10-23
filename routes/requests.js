'use strict'

const express = require('express')
const router = express.Router()
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

router.post(path + '/', (req, res) => {
})

router.get(path + '/:requestId', (req, res) => {
  res.send('requestId is set to ' + req.params.requestId)
})

router.put(path + '/:requestID', (req, res) => {
  res.send('requestId is set to ' + req.params.requestId)
})

module.exports = {router}
