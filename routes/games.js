'use strict'

const express = require('express')
const router = express.Router()
const getGames = require('../db/games').getGames

// All paths in this file should start with this
const path = '/games'

router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    message: '',
    games: null
  }
  getGames().then((games) => {
    let gameNames = []
    for (const game of games) {
      gameNames.push(game.name)
    }
    response.success = true
    response.games = gameNames
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = err.message
    return res.status(500).json(response)
  })
})

router.post(path + '/', (req, res) => {

})

router.get(path + '/:gameId', (req, res) => {
  res.send('gameId is set to ' + req.params.gameId)
})

module.exports = {router}
