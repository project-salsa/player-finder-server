const Game = require('./init').Game

function getGame(name) {
  return new Promise((resolve, reject) => {
    Game.findOne({ name:name }, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

module.exports = {
  getGame: getGame
}