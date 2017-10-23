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

function createRequestFromRaw(
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
          console.log("Other error")
          return reject(err)
        })
      }).catch((err) => {
        console.log("Game error")
        return reject(err)
      })
    }).catch((err) => {
      console.log("Name error")
      return reject(err)
    })
  })
}

function getRequest (requestID) {
  return new Promise((resolve, reject) => {
    Request.findOne({ _id: requestID }, (err, entry) => {
      if (err) {
        return reject(err)
      }
      else if (typeof(requestID) === undefined) {
        return reject(new Error('ERROR: Attempted to pass an undefined object into getRequest() function'))
      }
      return resolve(entry)
    })
  })
}


function getRequests() {
  return new Promise((resolve, reject) => {
    Request.find((err, requests) => {
      if (err !== null && typeof err !== 'undefined') {
        return reject(new Error(err))
      }
      return resolve(requests)
    })
  })
}

module.exports = {
    createRequestFromRaw,
    getRequest,
    getRequests
}
