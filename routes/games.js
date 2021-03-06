'use strict'

const express = require('express')
const router = express.Router()
const getGame = require('../db/games').getGame
const getGames = require('../db/games').getGames
const createGame = require('../db/games').createGame
const errorCodes = require('../db/init').errorCodes

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
  const reqData = req.body
  console.log(req.body)
  const response = {
    success: false,
    message: ''
  }
  const requiredValues = ['name', 'iconUrl', 'bannerUrl', 'genres', 'platforms']
  for (const value of requiredValues) {
    if (typeof reqData[value] === 'undefined' || reqData[value] === '') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  createGame(reqData.name, reqData.iconUrl, reqData.bannerUrl, reqData.genres, reqData.platforms).then(() => {
    response.success = true
    return res.status(201).json(response)
  }).catch((err) => {
    if (err.code === errorCodes.DUPLICATE_KEY) {
      response.message = 'name already taken'
      return res.status(400).json(response)
    }
    response.message = err.message
            // figure out if it was their fault or ours
    return res.status(500).json(response)
  })
})

/**
 * Gets a game from its name
 * Response body format:
 * {
 *    success: Boolean - true if successful, false otherwise
 *    message: String - error/success message
 *    game: Object - game object returned from the database
 * }
 * Response codes:
 * 200 - Success
 * 404 - Game does not exist
 * 500 - Something went wrong
 */
router.get(path + '/:gameName', (req, res) => {
  const gameName = req.params.gameName
  const response = {
    success: false,
    message: '',
    game: null
  }
  getGame(gameName).then((game) => {
    if (game === undefined) {
      response.message = "Specified game'" + gameName + "' does not exist"
      return res.status(404).json(response)
    }
    response.success = true
    response.game = game
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = err.message
    return res.status(500).json(response)
  })
})

module.exports = {router}
