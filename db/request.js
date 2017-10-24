'use strict'

const Game = require('./init').Game
const Request = require('./init').Request

function getRequestByGame (gameName) {
  return new Promise((resolve, reject) => {
    Game.find({'name': gameName}, (err, game) => {
      if (err !== null && typeof err !== 'undefined') {
        return reject(new Error(err))
      }
      console.log(game)
      if (game.length > 1) {
        // TODO Error needs to be logged
        return reject(new Error('There is a problem with the integrity of the database'))
      }

      Request.find({'game': game[0]._id}, (err, requests) => {
        if (err !== null && typeof err !== 'undefined') {
          return reject(new Error(err))
        }
        return resolve(requests)
      })
    })
  })
}

module.exports = {
  getRequestByGame
}
