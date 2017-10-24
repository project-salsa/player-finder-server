'use strict'

const Game = require('./init').Game
const Request = require('./init').Request

/**
 * Gets a list of requests based on a game name
 * @param gameName - String - The game name to query by
 * @return {Promise}
 *    resolve - [Object] - array of objects returned, [] if none found
 *        null is returned if game does not exist
 */
function getRequestByGame (gameName) {
  return new Promise((resolve, reject) => {
    Game.find({'name': gameName}, (err, game) => {
      if (err !== null && typeof err !== 'undefined') {
        return reject(new Error(err))
      }
      console.log(game)
      if (game.length > 1) {
        // TODO Error needs to be logged
        // There is a problem with the integrity of the database
      }
      if (game.length === 0) {
        // If there is no game with that name then the request is invalid
        // so we will resolve with null
        return resolve(null)
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
