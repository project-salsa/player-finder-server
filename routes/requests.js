'use strict'

const express = require('express')
const router = express.Router()
const getRequest = require('../db/requests').getRequest

// All paths in this file should start with this
const path = '/requests'

router.get(path + '/', (req, res) => {
})

router.post(path + '/', (req, res) => {
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
