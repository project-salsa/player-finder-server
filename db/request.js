const Request = require('./init').Request

/**
 * createGame - creates a new game in the DB based on parameters
 * @param name - String - name of the game
 * @param iconUrl - String -link to the icon used for the game
 * @param bannerUrl - String - link to the banner used for the game
 * @param genres - [String] - all of the genres of the game
 * @param platforms - [String] - available platforms the game is playable on
 * @returns {Promise} - resolves with data if successful, rejects with err if not
 */

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

function createRequest(title,user,game,platform,tags,location,maxPlayers,currentPlayers,isActive){
  return new Promise((resolve,reject) => {
    Request.create({
      title:title,
      user:user,
      game:game,
      platform:platform,
      tags:tags,
      location:location,
      maxPlayers:maxPlayers,
      currentPlayers:currentPlayers,
      isActive:isActive
    },
    function (err, data) {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

module.exports = {
  createRequest: createRequest
}

