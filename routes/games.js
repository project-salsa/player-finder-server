'use strict'

const express = require('express')
const router = express.Router()

// All paths in this file should start with this
const path = '/games'

router.get(path + '/', (req, res) => {

})

router.post(path + '/', (req, res) => {

})

router.get(path + '/:gameId', (req, res) => {
  res.send('gameId is set to ' + req.params.gameId)
})

module.exports = {router}
