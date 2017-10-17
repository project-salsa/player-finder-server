const Game = require('./init').Game

/**
 * createGame - creates a new game in the DB based on parameters
 * @param name - String - name of the game
 * @param iconUrl - String -link to the icon used for the game
 * @param bannerUrl - String - link to the banner used for the game
 * @param genres - [String] - all of the genres of the game
 * @param platforms - [String] - available platforms the game is playable on
 * @returns {Promise} - resolves with data if successful, rejects with err if not
 */
function createGame(name, iconUrl, bannerUrl, genres, platforms) {
  return new Promise((resolve, reject) => {
    Game.create({ name:name, iconUrl:iconUrl, bannerUrl:bannerUrl, genres:genres, platforms:platforms }, function (err, data) {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

module.exports = {
  createGame: createGame
}