'use strict'

const express = require('express')
const router = express.Router()

// All paths in this file should start with this
const path = '/requests'

router.get(path + '/', (req, res) => {
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
