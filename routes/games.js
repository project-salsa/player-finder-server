'use strict'

const express = require('express')
const router = express.Router()

// All paths in this file should start with this
const path = '/games'

router.get(path + '/', (req, res) => {

})

router.post(path + '/', (req, res) => {
    const reqData = req.body
    const response = {
        success: false,
        message: ''
    }
    const requiredValues = ['name', 'iconUrl', 'bannerUrl', 'genres', 'platforms']
    for (const value of requiredValues) {
        if (typeof reqData[value] === 'undefined') {
            response.message = 'Required field ' + value + ' is missing or blank'
            return res.status(400).json(response)
        }
    }
    users.createGame(reqData.name, reqData.iconUrl, reqData.bannerUrl, reqData.genres, reqData.platforms).then(() => {
        response.success = true
        res.status(201).json(response)
    }).catch((err) => {
        response.message = err.message
            // figure out if it was their fault or ours
        res.status(500).json(response)
    })
})

router.get(path + '/:gameId', (req, res) => {
  res.send('gameId is set to ' + req.params.gameId)
})

module.exports = {router}
