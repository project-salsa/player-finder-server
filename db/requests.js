const Game = require('./init').Game
const Request = require('./init').Request
const getUser = require('./users').getUser
const getGame = require('./games').getGame

/**
 * createRequest - create a new request(game room) in DB based on parameters
 * @param title - String - the title of the room
 * @param user - ObjectId - the user who created the room
 * @param game - ObjectId - the game the room plays
 * @param platform - String - the platform the room uses
 * @param tags - [String] - tags of the game or anything
 * @param location - String - the location of the user
 * @param maxPlayers - Number - maximum player in the room
 * @returns {Promise} - resolves with data if successful, rejects with err if not
 */
function createRequest (
  title,
  user,
  game,
  platform,
  tags,
  location,
  maxPlayers) {
  return new Promise((resolve, reject) => {
    if (createRequest.length !== arguments.length) {
      return reject(new Error('All args must be defined'))
    }
    Request.create({
      title: title,
      user: user,
      game: game,
      platform: platform,
      tags: tags,
      location: location,
      maxPlayers: maxPlayers,
      currentPlayers: [],
      isActive: true
    },
    (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

/**
 * createRequestFromRaw - takes raw data to pull ObjectId info and passes to createRequest
 * @param title - String - title of the post
 * @param user - String - name of the host
 * @param game - String - name of the game
 * @param platform - String - name of platform
 * @param tags - [String] - tags for search and filter
 * @param location - String - name of location
 * @param maxPlayers - Number - max number of players to play
 * @returns {Promise} - resolves with data if success, rejects with err otherwise
 */
function createRequestFromRaw (
  title,
  user,
  game,
  platform,
  tags,
  location,
  maxPlayers) {
  return new Promise((resolve, reject) => {
    let userId
    let gameId
    getUser(user).then((userObject) => {
      userId = userObject._id
      getGame(game).then((gameObject) => {
        gameId = gameObject._id
        createRequest(
          title,
          userId,
          gameId,
          platform,
          tags,
          location,
          maxPlayers
        ).then((data) => {
          return resolve(data)
        }).catch((err) => {
          console.log('Other error')
          return reject(err)
        })
      }).catch((err) => {
        console.log('Game error')
        return reject(err)
      })
    }).catch((err) => {
      console.log('Name error')
      return reject(err)
    })
  })
}

function getRequest (requestID) {
  return new Promise((resolve, reject) => {
    Request.findOne({ _id: requestID }, (err, entry) => {
      if (err) {
        return reject(err)
      } else if (typeof (requestID) === undefined) {
        return reject(new Error('ERROR: Attempted to pass an undefined object into getRequest() function'))
      }
      return resolve(entry)
    })
  })
}

function getRequests () {
  return new Promise((resolve, reject) => {
    Request.find((err, requests) => {
      if (err !== null && typeof err !== 'undefined') {
        return reject(new Error(err))
      }
      return resolve(requests)
    })
  })
}

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

getRequestByGame('Overwatch').then((res) => {
  console.log(res)
}).catch((err) => {
  console.log('err!', err)
})

module.exports = {
  createRequestFromRaw,
  getRequest,
  getRequests,
  getRequestByGame
}


