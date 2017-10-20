'use strict'

const User = require('./init').User

function createUser (username, password, email) {
  return new Promise((resolve, reject) => {
    if (createUser.length !== arguments.length) {
      return reject(new Error('All args must be defined'))
    }
    const newUser = new User(
      {
        username: username,
        password: password,
        email: email,
        subscribedTags: [],
        notificationTags: [],
        discordId: '',
        steamId: '',
        battleNetId: ''
      })

    newUser.save((err, data) => {
      if (err) {
        return reject(new Error(err))
      }

      return resolve(data)
    })
  })
}

/**
 * getUsers - gets all Usernames in the database
 * @returns {Promise} - resolves with users if successful, rejects with err if not
 */
function getUsers () {
  return new Promise((resolve, reject) => {
    User.find((err, users) => {
      if (err !== null && typeof err !== 'undefined') {
        return reject(new Error(err))
      }
      return resolve(users)
    })
  })
}

module.exports = {
  createUser,
  getUsers
}
