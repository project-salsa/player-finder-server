'use strict'

const Game = require('./init').Game
const Request = require('./init').Request

function getRequestByGame (gameName) {
  // query games for ObjectID
  return new Promise((resolve, reject) => {
    Game.find({'name': gameName}, (err, game) => {
      if (err !== null && typeof err !== 'undefined') {
        return reject(new Error(err))
      }
      console.log(game)
      if (game.length > 1) {
        return reject(new Error('Too many Games found'))
      }

      Request.find({'game': game[0]._id}, (err, requests) => {
        if (err !== null && typeof err !== 'undefined') {
          return reject(new Error(err))
        }
        return resolve(requests)
      })
    })
  })

  // query Requests w/ ObjectID
}

getRequestByGame('Overwatch')

module.exports = {
  getRequestByGame: getRequestByGame
}
