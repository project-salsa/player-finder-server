const Request = require('./init').Request
const User = require('./init').User

/**
 * Returns all requests for a specific user
 * @param username - String - username of user to get requests for
 * @return {Promise}
 *    resolve - [Object], or null
 *        resolves with array of request objects on success, empty array if none
 *        resolves with null if user does not exist
 *    reject - Error
 */
function getRequestsByUser (username) {
  return new Promise((resolve, reject) => {
    User.find({'username': username}).then((err, user) => {
      if (err !== null && typeof err !== 'undefined') {
        return reject(err)
      }
      if (user.length === 0) {
        return resolve(null)
      } else if (user.length > 1) {
        // TODO Log error that there is more than one user with the same name
      }
      Request.find({'user': user[0]._id}).then((err, requests) => {
        if (err !== null && typeof err !== 'undefined') {
          return reject(err)
        }
        return resolve(requests)
      }).catch((err) => {
        return reject(err)
      })
    }).catch((err) => {
      return reject(err)
    })
  })
}

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

module.exports = {
  getRequestsByUser,
  createRequest,
  getRequest
}
