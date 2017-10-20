const express = require('express')
const getGames = require('../db/games').getGames()
const router = express.Router()

router.get('/', (req, res) => {
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
    res.status(200).json(response)
  }).catch((err) => {
    response.message = err.message
    res.status(500).json(response)
  })
})
