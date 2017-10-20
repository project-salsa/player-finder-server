const Request = require('./init').Request

/**
 * createRequest - create a new request(game room) in DB based on parameters
 * @param title - String - the title of the room
 * @param user - ObjectId - the user who created the room
 * @param game - ObjectId - the game the room plays
 * @param platform - String - the platform the room uses
 * @param tags - [String] - tags of the game or anything
 * @param location - String - the location of the user
 * @param maxPlayers - Number - maximum player in the room
 * @param currentPlayers - [ObjectId] - a list of users
 * @param isActive - Boolean - if this room is active or not
 * @returns {Promise} - resolves with data if successful, rejects with err if not
 */
function createRequest (
  title,
  user,
  game,
  platform,
  tags,
  location,
  maxPlayers,
  currentPlayers,
  isActive) {
  return new Promise((resolve, reject) => {
    if (createUser.length !== arguments.length) {
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
      currentPlayers: currentPlayers,
      isActive: isActive
    },
    (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

module.exports = {
  createRequest
}
